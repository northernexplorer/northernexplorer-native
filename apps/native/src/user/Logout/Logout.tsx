import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import styles from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';
import {useDispatch} from 'react-redux';
import {clearAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function Logout() {
	const dispatch = useDispatch();
	const auth = useAuthentication();
	const {mutate} = useApiMutation('user', 'UserController', 'logout');

	useEffect(() => {
		const performLogout = async () => {
			try {
				if (auth?.refreshToken) {
					await mutate({refreshToken: auth.refreshToken});
				}
				dispatch(clearAuthentication());
			} catch (error) {
				console.error('Server logout failed, clearing local state anyway:', error);
			}
		};

		performLogout();
	}, []);

	return (
		<View style={{flex: 1}}>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>You have been successfully logged out.</Text>
		</View>
	);
}
