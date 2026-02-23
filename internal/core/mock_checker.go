package core

import "math/rand"

type MockPSPChecker struct{}

func (m *MockPSPChecker) CheckStatus(txID string) (ResolutionResult, error) {
	r := rand.Intn(3)
	switch r {
	case 0:
		return ResolutionSuccess, nil
	case 1:
		return ResolutionFailure, nil
	default:
		return ResolutionUnknown, nil
	}
}
