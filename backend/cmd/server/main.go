package main

import (
	"log"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/db"
	"example.com/oa-workorder/internal/http"
	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/service"
)

func main() {
	cfg := config.Load()
	database, err := db.Open(cfg)
	if err != nil {
		log.Fatalf("db open failed: %v", err)
	}

	if err := database.AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.Permission{},
		&models.UserRole{},
		&models.RolePermission{},
		&models.RefreshToken{},
		&models.APIKey{},
		&models.APINonce{},
		&models.Ticket{},
		&models.Department{},
		&models.FormDefinition{},
		&models.FormData{},
		&models.ExpenseReimbursement{},
		&models.ExpenseItem{},
		&models.Attachment{},
		&models.WorkflowTemplate{},
		&models.ProcessNode{},
		&models.WorkflowInstance{},
		&models.ApprovalLog{},
	); err != nil {
		log.Fatalf("auto migrate failed: %v", err)
	}

	if err := service.SeedDefaults(database, cfg); err != nil {
		log.Fatalf("seed failed: %v", err)
	}

	router := http.NewRouter(cfg, database)
	log.Printf("server listening on %s", cfg.Server.Addr)
	if err := router.Run(cfg.Server.Addr); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}
