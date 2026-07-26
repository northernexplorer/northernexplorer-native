import React, {createContext, useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {apiClient} from '~/core/apiClient';

const ConnectivityContext = createContext(false);

export function ConnectivityProvider({children}: {children: React.ReactNode}) {
	const [isDeviceConnected, setIsDeviceConnected] = useState(true);
	const [isServerReachable, setIsServerReachable] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsDeviceConnected(state.isConnected ?? true);
		});

		const checkServerStatus = async () => {
			try {
				const response = await apiClient(
					'system',
					'StatusController',
					'getOnlineStatus',
					{
						tick: Date.now(),
					},
					'GET',
				);
				setIsServerReachable(response !== false);
			} catch {
				setIsServerReachable(false);
			}
		};

		checkServerStatus();
		const interval = setInterval(checkServerStatus, 10000);

		return () => {
			unsubscribe();
			clearInterval(interval);
		};
	}, []);

	const isOffline = !isDeviceConnected || !isServerReachable;

	return <ConnectivityContext.Provider value={isOffline}>{children}</ConnectivityContext.Provider>;
}

export const useIsOffline = () => useContext(ConnectivityContext);
