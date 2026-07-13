import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useDispatch} from 'react-redux';
import {clearAuthentication} from '~/user/state/authentication/authenticationSlice';

export function Logout() {
	const dispatch = useDispatch();
	const {mutate} = useApiMutation('user', 'UserController', 'logout');

	useEffect(() => {
		const performLogout = async () => {
			try {
				await mutate({});
				dispatch(clearAuthentication());
			} catch (error) {
				console.error('Server logout failed, clearing local state anyway:', error);
			} finally {
			}
		};

		performLogout();
	}, []);

	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
			<Text style={[styles.title, {textAlign: 'center', marginBottom: 10}]}>Logged Out</Text>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>You have been successfully logged out.</Text>
		</View>
	);
}
