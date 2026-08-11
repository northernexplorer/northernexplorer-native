import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {RolesEnum} from '@northernexplorer/types';
import {Spinner} from '@northernexplorer/tools';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';

export function Admin() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data, loading} = useApiFetch('system', 'StatusController', 'getOverview', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	return (
		<View style={styles.grid}>
			{/* Published Sites Card */}
			<Pressable
				style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
				onPress={() => router.push('/admin/published-historic-sites')}
			>
				<View style={[styles.iconBadge, {backgroundColor: '#e8f5e9'}]}>
					<Ionicons name="map-outline" size={24} color="#2e7d32" />
				</View>
				<Text style={styles.statValue}>{data?.pointOfInterestsPublished ?? 0}</Text>
				<Text style={styles.statLabel}>Published Sites</Text>
			</Pressable>

			{/* Draft Sites Card */}
			<Pressable style={({pressed}) => [styles.card, pressed && styles.cardPressed]} onPress={() => router.push('/admin/draft-historic-sites')}>
				<View style={[styles.iconBadge, {backgroundColor: '#fff3e0'}]}>
					<Ionicons name="document-text-outline" size={24} color="#e65100" />
				</View>
				<Text style={styles.statValue}>{data?.pointOfInterestsDraft ?? 0}</Text>
				<Text style={styles.statLabel}>Draft Sites</Text>
			</Pressable>

			{/* Users Card */}
			<Pressable style={({pressed}) => [styles.card, pressed && styles.cardPressed]} onPress={() => router.push('/admin/users')}>
				<View style={[styles.iconBadge, {backgroundColor: '#e3f2fd'}]}>
					<Ionicons name="people-outline" size={24} color="#1565c0" />
				</View>
				<Text style={styles.statValue}>{data?.users ?? 0}</Text>
				<Text style={styles.statLabel}>Registered Users</Text>
			</Pressable>
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
	cardPressed: {
		opacity: 0.7,
		transform: [{scale: 0.98}],
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
