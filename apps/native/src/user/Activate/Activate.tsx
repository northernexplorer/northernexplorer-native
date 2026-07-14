import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useDispatch} from 'react-redux';

export function Activate() {
	const [accountRegistered, setAccountRegistered] = useState(false);
	const {mutate} = useApiMutation('user', 'UserController', 'activate');
	const dispatch = useDispatch();

	useEffect(() => {
		const activateAccount = async () => {
			try {
				const params = new URLSearchParams(window.location.search);
				const response = await mutate({activationToken: params.get('token') || ''});

				if (response.accessToken) {
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
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
				<Text style={[styles.title, {textAlign: 'center', marginBottom: 10}]}>Registration Completed!</Text>
				<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>You have been automatically signed in!</Text>
			</View>
		);
	}

	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
			<Text style={[styles.title, {textAlign: 'center', marginBottom: 10}]}>Registering your account...</Text>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Please wait!</Text>
		</View>
	);
}
