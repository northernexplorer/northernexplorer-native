import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Redirect} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function Admin() {
	const authentication = useAuthentication();
	const {data, loading} = useApiFetch('system', 'StatusController', 'getOverview', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (loading) return <Spinner />;

	return (
		<View style={styles.grid}>
			{/* Historic Sites Card */}
			<View style={styles.card}>
				<View style={[styles.iconBadge, {backgroundColor: '#e8f5e9'}]}>
					<Ionicons name="map-outline" size={24} color="#2e7d32" />
				</View>
				<Text style={styles.statValue}>{data?.historicSites ?? 0}</Text>
				<Text style={styles.statLabel}>Historic Sites</Text>
			</View>

			{/* Users Card */}
			<View style={styles.card}>
				<View style={[styles.iconBadge, {backgroundColor: '#e3f2fd'}]}>
					<Ionicons name="people-outline" size={24} color="#1565c0" />
				</View>
				<Text style={styles.statValue}>{data?.users ?? 0}</Text>
				<Text style={styles.statLabel}>Registered Users</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginBottom: 24,
	},

	grid: {
		flexDirection: 'row',
		gap: 16,
		marginBottom: 24,
	},
	card: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	iconBadge: {
		width: 44,
		height: 44,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	statValue: {
		fontSize: 26,
		fontWeight: '700',
		color: '#212529',
	},
	statLabel: {
		fontSize: 13,
		fontWeight: '500',
		color: '#6c757d',
		marginTop: 2,
	},
	section: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#212529',
		marginBottom: 12,
	},
	statusRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	statusText: {
		fontSize: 14,
		color: '#495057',
		fontWeight: '500',
	},
});
