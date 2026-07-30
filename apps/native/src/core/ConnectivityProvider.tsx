import React, {createContext, useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import {getBuildNumber} from 'react-native-device-info';
import {apiClient} from '~/core/apiClient';

interface ConnectivityState {
	isOffline: boolean;
	isRequiredAppUpdate: boolean;
}
const ConnectivityContext = createContext<ConnectivityState | undefined>(undefined);

export function ConnectivityProvider({children}: {children: React.ReactNode}) {
	const [isDeviceConnected, setIsDeviceConnected] = useState(true);
	const [isServerReachable, setIsServerReachable] = useState(true);
	const [isRequiredAppUpdate, setIsRequiredAppUpdate] = useState(false);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsDeviceConnected(state.isConnected ?? true);
		});

		const checkServerStatus = async () => {
			try {
				const response = await apiClient(
					'system',
					'StatusController',
					'getStatus',
					{
						tick: Date.now(),
						iosVersion: Platform.OS === 'ios' ? getBuildNumber() : '',
						androidVersion: Platform.OS === 'android' ? getBuildNumber() : '',
					},
					'GET',
				);
				setIsServerReachable(String(response.online).toLowerCase() === 'true');
				setIsRequiredAppUpdate(String(response.upgradeRequired).toLowerCase() === 'true');
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

	return <ConnectivityContext.Provider value={{isOffline, isRequiredAppUpdate}}>{children}</ConnectivityContext.Provider>;
}

export const useIsOffline = () => {
	const context = useContext(ConnectivityContext);
	if (context === undefined) {
		throw new Error('useIsOffline must be used within a ConnectivityProvider');
	}
	return context;
};
