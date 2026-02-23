package core

type ResolutionResult string

const (
	ResolutionSuccess ResolutionResult = "SUCCESS"
	ResolutionFailure ResolutionResult = "FAILURE"
	ResolutionUnknown ResolutionResult = "UNKNOWN"
)

type PSPStatusChecker interface {
	CheckStatus(txID string) (ResolutionResult, error)
}
