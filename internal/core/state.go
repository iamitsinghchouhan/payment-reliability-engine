package core

type State string

const (
	StatePending    State = "PENDING"
	StateProcessing State = "PROCESSING"
	StateUnknown    State = "UNKNOWN" // CRITICAL ADDITION
	StateRetrying   State = "RETRYING"
	StateSuccess    State = "SUCCESS"
	StateFailed     State = "FAILED"
)

var validTransitions = map[State][]State{
	StatePending: {StateProcessing},

	StateProcessing: {
		StateSuccess,
		StateRetrying,
		StateFailed,
		StateUnknown, // Timeout / lost response case
	},

	StateUnknown: {
		StateProcessing, // After resolution
		StateFailed,     // Verified failure
	},

	StateRetrying: {
		StateProcessing,
		StateFailed,
		StateUnknown, // Retry timeout possible
	},

	StateSuccess: {},
	StateFailed:  {},
}

func CanTransition(from, to State) bool {
	// Terminal states must NEVER transition
	if IsTerminal(from) {
		return false
	}

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
