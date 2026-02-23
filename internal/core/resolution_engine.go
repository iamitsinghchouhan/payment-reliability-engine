package core

import (
	"fmt"
	"time"
)

type ResolutionEngine struct {
	Checker PSPStatusChecker
}

func NewResolutionEngine(checker PSPStatusChecker) *ResolutionEngine {
	return &ResolutionEngine{Checker: checker}
}

func (e *ResolutionEngine) Resolve(tx *Transaction) error {
	if tx.State != StateUnknown {
		return fmt.Errorf("resolution only applies to UNKNOWN state, current: %s", tx.State)
	}

	if tx.ResolutionAttempts >= tx.MaxResolutionAttempts {
		return fmt.Errorf("max resolution attempts (%d) reached for tx %s", tx.MaxResolutionAttempts, tx.ID)
	}

	tx.ResolutionAttempts++
	tx.LastResolutionAttempt = time.Now().UTC()
	tx.UpdatedAt = time.Now().UTC()

	result, err := e.Checker.CheckStatus(tx.ID)
	if err != nil {
		return fmt.Errorf("PSP status check failed for tx %s: %w", tx.ID, err)
	}

	switch result {
	case ResolutionSuccess:
		return tx.Transition(StateSuccess)
	case ResolutionFailure:
		return tx.Transition(StateFailed)
	case ResolutionUnknown:
		return nil
	default:
		return fmt.Errorf("unexpected resolution result: %s", result)
	}
}
