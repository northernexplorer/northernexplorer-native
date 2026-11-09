import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {useDispatch} from 'react-redux';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useDeviceInfo} from '~/user/Login/useDeviceInfo';

type RouteParams = {
	token?: string | string[];
};

export function Activate() {
	const [accountRegistered, setAccountRegistered] = useState(false);
	const {token: routeToken} = useLocalSearchParams<RouteParams>();
	const token = Array.isArray(routeToken) ? routeToken[0] : routeToken;
	const {mutate} = useApiMutation('user', 'UserController', 'activate');
	const dispatch = useDispatch();
	const device = useDeviceInfo();

	useEffect(() => {
		const activateAccount = async () => {
			if (!token) {
				return;
			}

			try {
				const response = await mutate({activationToken: token, device});

				if (response?.accessToken) {
					dispatch(setAuthentication(response));
					setAccountRegistered(true);
				}
			} catch (error) {
				console.error('Account activation failed:', error);
			}
		};

		void activateAccount();
	}, []);

	if (accountRegistered) {
		return (
			<View style={{flex: 1}}>
				<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Registration Complete! You have been automatically signed in!</Text>
			</View>
		);
	}

	return (
		<View style={{flex: 1}}>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Please wait!</Text>
		</View>
	);
}
