package middleware

import (
	"bytes"
	"crypto/subtle"
	"io"
	"net/http"
	"strconv"
	"time"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RequireOpenAPISignature(cfg config.Config, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !cfg.Open.Enabled {
			response.Error(c, http.StatusForbidden, "OPEN_API_DISABLED", "open api disabled")
			c.Abort()
			return
		}

		keyID := c.GetHeader("X-API-Key")
		timestamp := c.GetHeader("X-API-Timestamp")
		nonce := c.GetHeader("X-API-Nonce")
		signature := c.GetHeader("X-API-Signature")

		if keyID == "" || timestamp == "" || nonce == "" || signature == "" {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "missing signature headers")
			c.Abort()
			return
		}

		ts, err := strconv.ParseInt(timestamp, 10, 64)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid timestamp")
			c.Abort()
			return
		}
		requestTime := time.Unix(ts, 0)
		now := time.Now()
		if requestTime.Before(now.Add(-cfg.Open.TimestampSkew)) || requestTime.After(now.Add(cfg.Open.TimestampSkew)) {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "timestamp out of range")
			c.Abort()
			return
		}

		var apiKey models.APIKey
		if err := db.Where("key_id = ? AND status = ?", keyID, "active").First(&apiKey).Error; err != nil {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid api key")
			c.Abort()
			return
		}

		// Prevent replay
		var existing models.APINonce
		err = db.Where("key_id = ? AND nonce = ? AND expires_at > ?", keyID, nonce, time.Now()).First(&existing).Error
		if err == nil {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "replay detected")
			c.Abort()
			return
		}

		body, _ := c.GetRawData()
		c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

		bodyHash := crypto.SHA256Hex(body)
		data := c.Request.Method + "\n" + c.Request.URL.Path + "\n" + timestamp + "\n" + nonce + "\n" + bodyHash
		expected := crypto.HMACSHA256Hex([]byte(apiKey.Secret), data)
		if subtle.ConstantTimeCompare([]byte(expected), []byte(signature)) != 1 {
			response.Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "invalid signature")
			c.Abort()
			return
		}

		expiresAt := time.Now().Add(cfg.Open.NonceTTL)
		_ = db.Create(&models.APINonce{KeyID: keyID, Nonce: nonce, ExpiresAt: expiresAt}).Error
		_ = db.Model(&apiKey).Update("last_used_at", time.Now()).Error

		c.Next()
	}
}
