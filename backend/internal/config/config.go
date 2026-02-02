package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Env    string
	Server ServerConfig
	DB     DBConfig
	Auth   AuthConfig
	Open   OpenAPIConfig
}

type ServerConfig struct {
	Addr           string
	TrustedProxies []string
	CORSOrigins    []string
}

type DBConfig struct {
	Driver string
	DSN    string
}

type AuthConfig struct {
	JWTIssuer        string
	JWTSecret        string
	AccessTokenTTL   time.Duration
	RefreshTokenTTL  time.Duration
	TokenLeeway      time.Duration
	PasswordMinLen   int
	AdminUsername    string
	AdminPassword    string
	AdminEmail       string
	AllowSignup      bool
	Require2FA       bool
	LoginFailMax     int
	LoginFailLockDur time.Duration
}

type OpenAPIConfig struct {
	Enabled       bool
	TimestampSkew time.Duration
	NonceTTL      time.Duration
}

func Load() Config {
	cfg := Config{}
	cfg.Env = getEnv("ENV", "dev")
	cfg.Server.Addr = getEnv("SERVER_ADDR", ":8080")
	cfg.Server.TrustedProxies = splitCSV(getEnv("TRUSTED_PROXIES", ""))
	cfg.Server.CORSOrigins = splitCSV(getEnv("CORS_ORIGINS", ""))

	cfg.DB.Driver = getEnv("DB_DRIVER", "sqlite")
	cfg.DB.DSN = getEnv("DB_DSN", "file:oa.db?cache=shared&_fk=1")

	cfg.Auth.JWTIssuer = getEnv("JWT_ISSUER", "oa-workorder")
	cfg.Auth.JWTSecret = getEnv("JWT_SECRET", "dev-secret-change-me")
	cfg.Auth.AccessTokenTTL = getDuration("ACCESS_TOKEN_TTL", 15*time.Minute)
	cfg.Auth.RefreshTokenTTL = getDuration("REFRESH_TOKEN_TTL", 30*24*time.Hour)
	cfg.Auth.TokenLeeway = getDuration("TOKEN_LEEWAY", 2*time.Minute)
	cfg.Auth.PasswordMinLen = getInt("PASSWORD_MIN_LEN", 8)
	cfg.Auth.AdminUsername = getEnv("ADMIN_USERNAME", "admin")
	cfg.Auth.AdminPassword = getEnv("ADMIN_PASSWORD", "admin123")
	cfg.Auth.AdminEmail = getEnv("ADMIN_EMAIL", "admin@example.com")
	cfg.Auth.AllowSignup = getBool("ALLOW_SIGNUP", false)
	cfg.Auth.Require2FA = getBool("REQUIRE_2FA", false)
	cfg.Auth.LoginFailMax = getInt("LOGIN_FAIL_MAX", 5)
	cfg.Auth.LoginFailLockDur = getDuration("LOGIN_FAIL_LOCK_DUR", 15*time.Minute)

	cfg.Open.Enabled = getBool("OPEN_API_ENABLED", true)
	cfg.Open.TimestampSkew = getDuration("OPEN_API_TS_SKEW", 5*time.Minute)
	cfg.Open.NonceTTL = getDuration("OPEN_API_NONCE_TTL", 10*time.Minute)

	return cfg
}

func splitCSV(s string) []string {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func getEnv(key, def string) string {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return def
	}
	return v
}

func getBool(key string, def bool) bool {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return def
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return def
	}
	return b
}

func getInt(key string, def int) int {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return def
	}
	i, err := strconv.Atoi(v)
	if err != nil {
		return def
	}
	return i
}

func getDuration(key string, def time.Duration) time.Duration {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return def
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return def
	}
	return d
}
