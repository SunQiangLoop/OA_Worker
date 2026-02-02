package main

import (
	"flag"
	"fmt"
	"log"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/db"
	"example.com/oa-workorder/internal/service"
)

func main() {
	name := flag.String("name", "integration", "API key name")
	flag.Parse()

	cfg := config.Load()
	database, err := db.Open(cfg)
	if err != nil {
		log.Fatalf("db open failed: %v", err)
	}

	keyID, secret, err := service.CreateAPIKey(database, *name)
	if err != nil {
		log.Fatalf("create api key failed: %v", err)
	}

	fmt.Printf("API_KEY_ID=%s\n", keyID)
	fmt.Printf("API_KEY_SECRET=%s\n", secret)
}
