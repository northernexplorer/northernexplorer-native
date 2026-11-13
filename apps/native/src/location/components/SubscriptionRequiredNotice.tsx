import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export function SubscriptionRequiredNotice() {
	return (
		<View style={styles.container}>
			<Ionicons name="lock-closed" size={22} color="#e67e22" />
			<Text style={styles.title}>Subscription Required</Text>
			<Text style={styles.message}>Sign in or upgrade your account to view details for this location.</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'stretch',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '700',
		marginTop: 6,
	},
	message: {
		color: '#94a3b8',
		fontSize: 11,
		lineHeight: 15,
		marginTop: 4,
		textAlign: 'center',
	},
});
