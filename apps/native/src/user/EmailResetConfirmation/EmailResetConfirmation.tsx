import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {router} from 'expo-router';
import styles from '~/user/styles';

export function EmailResetConfirmation() {
	const authentication = useAuthentication();
	useEffect(() => {
		if (authentication?.username) {
			router.replace(`/profile/${authentication.username}`);
		}
	}, [authentication?.username]);

	return (
		<View style={{flex: 1}}>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Click the link to reset your password.</Text>
		</View>
	);
}
