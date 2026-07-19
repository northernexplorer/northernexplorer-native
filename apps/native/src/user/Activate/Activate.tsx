import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useDeviceInfo} from '~/user/Login/useDeviceInfo';

export function Activate() {
	const [accountRegistered, setAccountRegistered] = useState(false);
	const {mutate} = useApiMutation('user', 'UserController', 'activate');
	const dispatch = useDispatch();
	const device = useDeviceInfo();

	useEffect(() => {
		const activateAccount = async () => {
			try {
				const params = new URLSearchParams(window.location.search);
				const response = await mutate({activationToken: params.get('token') || '', device});

				if (response?.accessToken) {
					dispatch(setAuthentication(response));
					setAccountRegistered(true);
				}
			} catch (error) {
				console.error('Account activation failed:', error);
			}
		};

		activateAccount();
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
