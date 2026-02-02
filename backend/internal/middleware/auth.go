package middleware

import (
	"net/http"
	"strings"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const ctxUserIDKey = "userID"

func RequireAuth(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := extractBearer(c.GetHeader("Authorization"))
		if token == "" {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing access token")
			c.Abort()
			return
		}

		claims, err := crypto.ParseToken(token, cfg.Auth.JWTIssuer, cfg.Auth.JWTSecret, cfg.Auth.TokenLeeway)
		if err != nil || claims.Type != "access" {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid access token")
			c.Abort()
			return
		}

		c.Set(ctxUserIDKey, claims.UserID)
		c.Next()
	}
}

func RequirePermission(db *gorm.DB, perm string) gin.HandlerFunc {
	return func(c *gin.Context) {
		uidVal, ok := c.Get(ctxUserIDKey)
		if !ok {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing user")
			c.Abort()
			return
		}
		uid, ok := uidVal.(uint)
		if !ok {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid user")
			c.Abort()
			return
		}

		var count int64
		err := db.Model(&models.User{}).
			Joins("JOIN user_roles ur ON ur.user_id = users.id").
			Joins("JOIN role_permissions rp ON rp.role_id = ur.role_id").
			Joins("JOIN permissions p ON p.id = rp.permission_id").
			Where("users.id = ? AND p.code = ?", uid, perm).
			Count(&count).Error
		if err != nil || count == 0 {
			response.Error(c, http.StatusForbidden, "FORBIDDEN", "permission denied")
			c.Abort()
			return
		}
		c.Next()
	}
}

func UserID(c *gin.Context) (uint, bool) {
	uidVal, ok := c.Get(ctxUserIDKey)
	if !ok {
		return 0, false
	}
	uid, ok := uidVal.(uint)
	return uid, ok
}

func extractBearer(h string) string {
	if h == "" {
		return ""
	}
	parts := strings.SplitN(h, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return strings.TrimSpace(parts[1])
}
