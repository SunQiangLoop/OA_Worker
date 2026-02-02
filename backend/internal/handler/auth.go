package handler

import (
	"net/http"
	"time"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB  *gorm.DB
	Cfg config.Config
}

const sliderTokenTTL = 2 * time.Minute

type loginRequest struct {
	Username    string `json:"username" binding:"required"`
	Password    string `json:"password" binding:"required"`
	SliderToken string `json:"slider_token" binding:"required"`
}

type tokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	claims, err := crypto.ParseToken(req.SliderToken, h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.TokenLeeway)
	if err != nil || claims.Type != "slider" {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "slider verification required")
		return
	}

	var user models.User
	if err := h.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid credentials")
		return
	}

	if user.Status != "active" {
		response.Error(c, http.StatusForbidden, "FORBIDDEN", "user disabled")
		return
	}

	if user.LockUntil != nil && user.LockUntil.After(time.Now()) {
		response.Error(c, http.StatusForbidden, "FORBIDDEN", "account locked")
		return
	}

	ok, err := crypto.VerifyPassword(req.Password, user.PasswordHash)
	if err != nil || !ok {
		user.FailedCount++
		if user.FailedCount >= h.Cfg.Auth.LoginFailMax {
			lockUntil := time.Now().Add(h.Cfg.Auth.LoginFailLockDur)
			user.LockUntil = &lockUntil
		}
		_ = h.DB.Save(&user).Error
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid credentials")
		return
	}

	user.FailedCount = 0
	user.LockUntil = nil
	last := time.Now()
	user.LastLoginAt = &last
	_ = h.DB.Save(&user).Error

	access, err := crypto.SignToken(user.ID, "access", h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.AccessTokenTTL)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to sign token")
		return
	}
	refresh, err := crypto.SignToken(user.ID, "refresh", h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.RefreshTokenTTL)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to sign token")
		return
	}

	hash := crypto.SHA256Hex([]byte(refresh))
	_ = h.DB.Create(&models.RefreshToken{UserID: user.ID, TokenHash: hash, ExpiresAt: time.Now().Add(h.Cfg.Auth.RefreshTokenTTL)}).Error

	response.OK(c, tokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		ExpiresIn:    int64(h.Cfg.Auth.AccessTokenTTL.Seconds()),
	})
}

type sliderVerifyRequest struct {
	Value int `json:"value" binding:"required"`
}

type sliderVerifyResponse struct {
	SliderToken string `json:"slider_token"`
	ExpiresIn   int64  `json:"expires_in"`
}

func (h *AuthHandler) SliderVerify(c *gin.Context) {
	var req sliderVerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	if req.Value < 98 {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "slider not completed")
		return
	}

	token, err := crypto.SignToken(0, "slider", h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, sliderTokenTTL)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to sign slider token")
		return
	}

	response.OK(c, sliderVerifyResponse{
		SliderToken: token,
		ExpiresIn:   int64(sliderTokenTTL.Seconds()),
	})
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	claims, err := crypto.ParseToken(req.RefreshToken, h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.TokenLeeway)
	if err != nil || claims.Type != "refresh" {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid refresh token")
		return
	}

	hash := crypto.SHA256Hex([]byte(req.RefreshToken))
	var stored models.RefreshToken
	if err := h.DB.Where("token_hash = ? AND revoked_at IS NULL AND expires_at > ?", hash, time.Now()).First(&stored).Error; err != nil {
		response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "refresh token not found")
		return
	}

	now := time.Now()
	stored.RevokedAt = &now
	_ = h.DB.Save(&stored).Error

	access, err := crypto.SignToken(claims.UserID, "access", h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.AccessTokenTTL)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to sign token")
		return
	}
	refresh, err := crypto.SignToken(claims.UserID, "refresh", h.Cfg.Auth.JWTIssuer, h.Cfg.Auth.JWTSecret, h.Cfg.Auth.RefreshTokenTTL)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to sign token")
		return
	}
	newHash := crypto.SHA256Hex([]byte(refresh))
	_ = h.DB.Create(&models.RefreshToken{UserID: claims.UserID, TokenHash: newHash, ExpiresAt: time.Now().Add(h.Cfg.Auth.RefreshTokenTTL)}).Error

	response.OK(c, tokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		ExpiresIn:    int64(h.Cfg.Auth.AccessTokenTTL.Seconds()),
	})
}

type logoutRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func (h *AuthHandler) Logout(c *gin.Context) {
	var req logoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid payload")
		return
	}

	hash := crypto.SHA256Hex([]byte(req.RefreshToken))
	_ = h.DB.Model(&models.RefreshToken{}).Where("token_hash = ?", hash).Update("revoked_at", time.Now()).Error
	response.OK(c, gin.H{"revoked": true})
}
