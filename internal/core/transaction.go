package core

import (
	"fmt"
	"time"
)

type Transaction struct {
	ID        string
	Amount    int64
	Currency  string
	State     State
	Retries   int
	MaxRetries int
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewTransaction(id string, amount int64, currency string) *Transaction {
	now := time.Now().UTC()
	return &Transaction{
		ID:         id,
		Amount:     amount,
		Currency:   currency,
		State:      StatePending,
		Retries:    0,
		MaxRetries: 5,
		CreatedAt:  now,
		UpdatedAt:  now,
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

func (t *Transaction) ShouldRetry() bool {
	return t.Retries < t.MaxRetries && !IsTerminal(t.State)
}

func (t *Transaction) IncrementRetry() {
	t.Retries++
	t.UpdatedAt = time.Now().UTC()
}

func (t *Transaction) RetryDelay() time.Duration {
	base := time.Second
	return base * time.Duration(1<<uint(t.Retries))
}
