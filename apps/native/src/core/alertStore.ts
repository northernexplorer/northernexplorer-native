export type AlertButton = {
	text: string;
	style?: 'cancel' | 'destructive' | 'default';
	onPress?: () => void;
};

export type AlertState = {
	message: string | null;
	type: 'error' | 'warning' | 'success';
	title?: string;
	buttons?: AlertButton[];
};

let listeners: Array<(state: AlertState) => void> = [];
let state: AlertState = {message: null, type: 'error'};

export const alertStore = {
	showAlert: (messageOrOptions: {message: string; type: 'error' | 'warning' | 'success'; title?: string; buttons?: AlertButton[]}) => {
		state = {
			message: messageOrOptions.message,
			type: messageOrOptions.type,
			title: messageOrOptions.title,
			buttons: messageOrOptions.buttons,
		};
		listeners.forEach(l => l(state));
	},
	clearAlert: () => {
		state = {message: null, type: 'error', title: undefined, buttons: undefined};
		listeners.forEach(l => l(state));
	},
	subscribe: (listener: (state: AlertState) => void) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	},
};
