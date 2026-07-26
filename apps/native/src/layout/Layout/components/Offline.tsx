import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export function Offline() {
	return (
		<View style={styles.container}>
			<View style={styles.iconBadge}>
				<MaterialCommunityIcons name="wifi-off" size={32} color="#d9d9d9" />
			</View>

			<Text style={styles.title}>You’re Offline</Text>
			<Text style={styles.subtitle}>Please check your internet connection. Some features are unavailable until you re-connect.</Text>

			<View style={styles.pill}>
				<View style={styles.statusDot} />
				<Text style={styles.pillText}>Viewing cached mode</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	iconBadge: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: 20,
	},
	pill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1a1a1a',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#334155',
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#f59e0b',
		marginRight: 8,
	},
	pillText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#cbd5e1',
	},
});
