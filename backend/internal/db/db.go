package db

import (
	"fmt"
	"time"

	"example.com/oa-workorder/internal/config"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Open(cfg config.Config) (*gorm.DB, error) {
	var dialector gorm.Dialector
	switch cfg.DB.Driver {
	case "sqlite":
		dialector = sqlite.Open(cfg.DB.DSN)
	case "mysql":
		dialector = mysql.Open(cfg.DB.DSN)
	case "postgres":
		dialector = postgres.Open(cfg.DB.DSN)
	default:
		return nil, fmt.Errorf("unsupported DB_DRIVER: %s", cfg.DB.Driver)
	}

	gcfg := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	db, err := gorm.Open(dialector, gcfg)
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	return db, nil
}
