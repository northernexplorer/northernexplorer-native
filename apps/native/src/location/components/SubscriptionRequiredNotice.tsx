import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type Props = {
	theme?: 'dark' | 'light';
};

export function SubscriptionRequiredNotice({theme = 'dark'}: Props) {
	return (
		<View style={styles.container}>
			<Ionicons name="lock-closed" size={22} color="#e67e22" />
			<Text style={[styles.title, theme === 'light' && styles.lightTitle]}>Subscription Required</Text>
			<Text style={[styles.message, theme === 'light' && styles.lightMessage]}>
				Sign in or upgrade your account to view details for this location.
			</Text>
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
	lightTitle: {
		color: '#334155',
	},
	message: {
		color: '#94a3b8',
		fontSize: 11,
		lineHeight: 15,
		marginTop: 4,
		textAlign: 'center',
	},
	lightMessage: {
		color: '#64748b',
	},
});
