import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {styles} from '~/user/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {router} from 'expo-router';

export function EmailConfirmation() {
	const authentication = useAuthentication();
	useEffect(() => {
		if (authentication?.username) {
			router.replace(`/profile/${authentication.username}`);
		}
	}, [authentication?.username]);

	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
			<Text style={[styles.title, {textAlign: 'center', marginBottom: 10}]}>You have been sent an email.</Text>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>
				Click the link to verify your email address and complete registration.
			</Text>
		</View>
	);
}
