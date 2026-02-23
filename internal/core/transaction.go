package core

import (
        "fmt"
        "time"
)

type Transaction struct {
        ID                    string
        Amount                int64
        Currency              string
        State                 State
        Retries               int
        MaxRetries            int
        LastResolutionAttempt time.Time
        ResolutionAttempts    int
        MaxResolutionAttempts int
        CreatedAt             time.Time
        UpdatedAt             time.Time
}

func NewTransaction(id string, amount int64, currency string) *Transaction {
        now := time.Now().UTC()

        return &Transaction{
                ID:                    id,
                Amount:                amount,
                Currency:              currency,
                State:                 StatePending,
                Retries:               0,
                MaxRetries:            5,
                ResolutionAttempts:    0,
                MaxResolutionAttempts: 10,
                CreatedAt:             now,
                UpdatedAt:             now,
        }
}

func (t *Transaction) Transition(to State) error {
        if !CanTransition(t.State, to) {
                return fmt.Errorf("invalid transition from %s to %s", t.State, to)
        }

        t.State = to
        t.UpdatedAt = time.Now().UTC()

        return nil
}

// UNKNOWN must NEVER retry blindly
func (t *Transaction) ShouldRetry() bool {
        if t.State == StateUnknown {
                return false
        }

        return t.Retries < t.MaxRetries && !IsTerminal(t.State)
}

// Explicit semantic naming prevents future confusion
func (t *Transaction) MarkRetryAttempt() {
        t.Retries++
        t.UpdatedAt = time.Now().UTC()
}

// Production-safe capped exponential backoff
func (t *Transaction) RetryDelay() time.Duration {
        base := time.Second
        maxDelay := 30 * time.Second

        delay := base * time.Duration(1<<uint(t.Retries))

        if delay > maxDelay {
                return maxDelay
        }

        return delay
}