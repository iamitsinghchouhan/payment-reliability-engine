package core

type State string

const (
	StatePending   State = "PENDING"
	StateProcessing State = "PROCESSING"
	StateRetrying  State = "RETRYING"
	StateSuccess   State = "SUCCESS"
	StateFailed    State = "FAILED"
)

var validTransitions = map[State][]State{
	StatePending:    {StateProcessing},
	StateProcessing: {StateSuccess, StateRetrying, StateFailed},
	StateRetrying:   {StateProcessing, StateFailed},
	StateSuccess:    {},
	StateFailed:     {},
}

func CanTransition(from, to State) bool {
	allowed, ok := validTransitions[from]
	if !ok {
		return false
	}
	for _, s := range allowed {
		if s == to {
			return true
		}
	}
	return false
}

func IsTerminal(s State) bool {
	return s == StateSuccess || s == StateFailed
}
