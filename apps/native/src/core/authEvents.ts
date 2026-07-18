type AuthEvent = 'FORCE_LOGOUT';
const listeners: ((event: AuthEvent) => void)[] = [];

export const authEvents = {
	emit: (event: AuthEvent) => listeners.forEach(fn => fn(event)),
	subscribe: (fn: (event: AuthEvent) => void) => {
		listeners.push(fn);
		return () => {
			const index = listeners.indexOf(fn);
			if (index > -1) listeners.splice(index, 1);
		};
	},
};
