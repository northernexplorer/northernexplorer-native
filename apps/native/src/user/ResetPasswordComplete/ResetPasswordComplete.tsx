import React from 'react';
import {Text, View} from 'react-native';
import styles from '~/user/styles';

export function ResetPasswordComplete() {
	return (
		<View style={{flex: 1}}>
			<Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>Your password has been successfully changed. You can now sign in!</Text>
		</View>
	);
}
