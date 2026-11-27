import {PropsWithChildren, createContext, useCallback, useContext} from 'react';
import {AppState} from 'react-native';
import {useFocusEffect} from 'expo-router';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type NotificationStatus = {
	hasUnread: boolean;
	refreshUnreadStatus: () => Promise<void>;
};

const NotificationStatusContext = createContext<NotificationStatus>({
	hasUnread: false,
	refreshUnreadStatus: () => Promise.resolve(),
});

export function NotificationProvider({children}: PropsWithChildren) {
	const authentication = useAuthentication();

	return (
		<NotificationStatusProvider key={authentication?.userId ?? 'anonymous'} userId={authentication?.userId}>
			{children}
		</NotificationStatusProvider>
	);
}

function NotificationStatusProvider({children, userId}: PropsWithChildren<{userId?: string}>) {
	const {data, refetch} = useApiFetch('system', 'NotificationController', 'getUnreadStatus', userId ? {} : null, {skip: !userId});

	useFocusEffect(
		useCallback(() => {
			let interval: ReturnType<typeof setInterval> | undefined;
			const startPolling = () => {
				if (!interval) interval = setInterval(() => void refetch(), 60_000);
			};
			const stopPolling = () => {
				if (interval) clearInterval(interval);
				interval = undefined;
			};

			if (AppState.currentState === 'active') startPolling();
			const subscription = AppState.addEventListener('change', state => {
				if (state === 'active') {
					void refetch();
					startPolling();
				} else {
					stopPolling();
				}
			});

			return () => {
				stopPolling();
				subscription.remove();
			};
		}, [refetch]),
	);

	const refreshUnreadStatus = useCallback(() => refetch(), [refetch]);

	return (
		<NotificationStatusContext.Provider value={{hasUnread: data?.hasUnread ?? false, refreshUnreadStatus}}>
			{children}
		</NotificationStatusContext.Provider>
	);
}

export function useNotificationStatus() {
	return useContext(NotificationStatusContext);
}
