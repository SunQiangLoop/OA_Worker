package crypto

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID uint   `json:"uid"`
	Type   string `json:"typ"`
	jwt.RegisteredClaims
}

func SignToken(userID uint, tokenType string, issuer, secret string, ttl time.Duration) (string, error) {
	claims := Claims{
		UserID: userID,
		Type:   tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    issuer,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseToken(tokenStr, issuer, secret string, leeway time.Duration) (*Claims, error) {
	parser := jwt.NewParser(jwt.WithLeeway(leeway))
	claims := &Claims{}
	_, err := parser.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims.Issuer != issuer {
		return nil, errors.New("invalid issuer")
	}
	return claims, nil
}
