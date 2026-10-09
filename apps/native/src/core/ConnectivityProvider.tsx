import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
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
	const failureCountRef = useRef(0);

	useEffect(() => {
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
				failureCountRef.current = 0;
				setIsServerReachable(String(response.online).toLowerCase() === 'true');
				setIsRequiredAppUpdate(String(response.upgradeRequired).toLowerCase() === 'true');
			} catch {
				failureCountRef.current += 1;
				// Require 3 consecutive failed checks before marking server unreachable to prevent transient blips from unmounting active views
				if (failureCountRef.current >= 3) {
					setIsServerReachable(false);
				}
			}
		};

		const unsubscribe = NetInfo.addEventListener(state => {
			const connected = state.isConnected ?? true;
			setIsDeviceConnected(connected);
			if (connected) {
				checkServerStatus();
			}
		});

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
