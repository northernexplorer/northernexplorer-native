type AlertState = {message: string | null; type: 'error' | 'warning' | 'success'};
let listeners: Array<(state: AlertState) => void> = [];
let state: AlertState = {message: null, type: 'error'};

export const alertStore = {
	showAlert: (message: string, type: 'error' | 'warning' | 'success') => {
		state = {message, type};
		listeners.forEach(l => l(state));
	},
	clearAlert: () => {
		state = {message: null, type: 'error'};
		listeners.forEach(l => l(state));
	},
	subscribe: (listener: (state: AlertState) => void) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	},
};
