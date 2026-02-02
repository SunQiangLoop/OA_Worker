package crypto

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

func HMACSHA256Hex(secret []byte, data string) string {
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(data))
	return hex.EncodeToString(mac.Sum(nil))
}

func SHA256Hex(data []byte) string {
	h := sha256.Sum256(data)
	return hex.EncodeToString(h[:])
}
