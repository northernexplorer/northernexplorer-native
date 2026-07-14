type AlertState = {message: string | null};
let listeners: Array<(state: AlertState) => void> = [];
let state: AlertState = {message: null};

export const alertStore = {
	showAlert: (message: string) => {
		state = {message};
		listeners.forEach(l => l(state));
	},
	clearAlert: () => {
		state = {message: null};
		listeners.forEach(l => l(state));
	},
	subscribe: (listener: (state: AlertState) => void) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	},
};
