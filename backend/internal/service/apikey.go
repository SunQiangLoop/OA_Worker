package service

import (
	"fmt"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/pkg/crypto"
	"gorm.io/gorm"
)

func CreateAPIKey(db *gorm.DB, name string) (string, string, error) {
	keyID, err := crypto.RandomHex(8)
	if err != nil {
		return "", "", err
	}
	secret, err := crypto.RandomHex(32)
	if err != nil {
		return "", "", err
	}

	apiKey := models.APIKey{
		Name:   name,
		KeyID:  fmt.Sprintf("oa_%s", keyID),
		Secret: secret,
		Status: "active",
	}
	if err := db.Create(&apiKey).Error; err != nil {
		return "", "", err
	}
	return apiKey.KeyID, secret, nil
}
