import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';

export function ProFeatureOnly() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.centerContainer}>
				<MaterialCommunityIcons name="lock-open-alert-outline" size={80} color="#64748b" />
				<Text style={styles.unavailableTitle}>Pro Feature</Text>
				<Text style={styles.unavailableSubtext}>
					This feature is not available on your current plan. Upgrade your subscription level to unlock access.
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	unavailableTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#0f172a',
		marginTop: 16,
		marginBottom: 8,
		textAlign: 'center',
	},
	unavailableSubtext: {
		fontSize: 15,
		color: '#475569',
		textAlign: 'center',
		lineHeight: 22,
	},
});
