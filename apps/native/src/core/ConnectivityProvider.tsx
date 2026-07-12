import React, {createContext, useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useApiFetch} from '~/core/useApiFetch';

const ConnectivityContext = createContext(false);

export function ConnectivityProvider({children}: {children: React.ReactNode}) {
	const [tick, setTick] = useState(0);
	const [isDeviceConnected, setIsDeviceConnected] = useState(true);

	const {data, error} = useApiFetch('system', 'StatusController', 'getOnlineStatus', {
		tick,
	});

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsDeviceConnected(state.isConnected ?? true);
		});

		const interval = setInterval(() => setTick(prev => prev + 1), 10000);

		return () => {
			unsubscribe();
			clearInterval(interval);
		};
	}, []);

	const isOffline = !isDeviceConnected || !!error || data === false;

	return <ConnectivityContext.Provider value={isOffline}>{children}</ConnectivityContext.Provider>;
}

// Hook for components to use
export const useIsOffline = () => useContext(ConnectivityContext);
