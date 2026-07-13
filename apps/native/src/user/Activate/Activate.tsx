import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {styles} from '~/user/styles';
import {useApiMutation} from '~/core/useApiMutation';

export function Activate() {
	const {mutate} = useApiMutation('user', 'UserController', 'activate');

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		mutate({activationToken: params.get('token') || ''});
	}, []);
	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
			<Text style={[styles.title, {textAlign: 'center', marginBottom: 10}]}>Thank you for registering</Text>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Your account has been successfully created.</Text>
		</View>
	);
}
