package main

import (
	"fmt"
	"log"
	"os"

	"payment-reliability-engine/internal/store"
)

func main() {
	dbPath := "./data/engine.db"

	if err := os.MkdirAll("./data", 0755); err != nil {
		log.Fatalf("failed to create data directory: %v", err)
	}

	db, err := store.NewSQLiteStore(dbPath)
	if err != nil {
		log.Fatalf("failed to initialize SQLite database: %v", err)
	}
	defer db.Close()

	fmt.Println("Payment Reliability Engine")
	fmt.Println("==========================")
	fmt.Printf("SQLite database initialized at %s\n", dbPath)
	fmt.Println("Engine is ready.")
}
