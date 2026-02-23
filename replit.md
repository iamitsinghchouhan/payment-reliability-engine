# Payment Reliability Engine

## Overview

A **backend-only Go (Golang) project** implementing a payment reliability engine with SQLite persistence, a transaction state machine, retry logic with exponential backoff, and clean internal package structure following standard Go practices.

## User Preferences

- Backend-only, no frontend/UI/React code
- Go standard library + `modernc.org/sqlite` (pure Go SQLite driver)
- Standard Go project layout with `cmd/` and `internal/` packages

## Project Structure

```
payment-reliability-engine/
├── cmd/
│   └── server/
│       └── main.go          # Entry point: initializes SQLite and prints confirmation
├── internal/
│   ├── core/
│   │   ├── state.go         # Transaction state machine with valid transitions
│   │   └── transaction.go   # Transaction model with retry logic
│   └── store/
│       └── sqlite.go        # SQLite persistence layer with auto-migration
├── data/
│   └── engine.db            # SQLite database file (auto-created at runtime)
├── go.mod
└── go.sum
```

## Architecture

### State Machine (`internal/core/state.go`)
Defines transaction states and valid transitions:
- `PENDING` → `PROCESSING`
- `PROCESSING` → `SUCCESS`, `RETRYING`, `FAILED`
- `RETRYING` → `PROCESSING`, `FAILED`
- `SUCCESS` and `FAILED` are terminal states

### Transaction Model (`internal/core/transaction.go`)
- Tracks amount, currency, state, retry count
- Exponential backoff delay calculation for retries
- Max 5 retries by default

### SQLite Store (`internal/store/sqlite.go`)
- Uses `modernc.org/sqlite` (pure Go, no CGo)
- Auto-creates `transactions` table with index on `state` column
- Connection lifecycle management

### Entry Point (`cmd/server/main.go`)
- Creates `./data/` directory if missing
- Initializes SQLite database at `./data/engine.db`
- Prints confirmation message

## How to Run

```bash
go run ./cmd/server/
```

## Dependencies

- Go 1.23
- `modernc.org/sqlite` — Pure Go SQLite driver
