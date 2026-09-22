import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function Admin() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data, loading} = useApiFetch('system', 'StatusController', 'getOverview', {});

	if (!authentication) return <Redirect href="/user/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	const draftCount = data?.pointOfInterestsDraft ?? 0;
	const pendingReviewsCount = data?.pendingReviews ?? 0;
	const pendingImagesCount = data?.pendingImages ?? 0;

	return (
		<View style={styles.grid}>
			{/* Draft Sites Card */}
			<Pressable
				style={({pressed}) => [styles.card, draftCount > 0 && styles.cardUrgent, pressed && styles.cardPressed]}
				onPress={() => router.push('/admin/draft-point-of-interest')}
			>
				{draftCount > 0 && <View style={styles.badgeDot} />}
				<View style={[styles.iconBadge, {backgroundColor: '#fff3e0'}]}>
					<Ionicons name="document-text-outline" size={24} color="#e65100" />
				</View>
				<Text style={styles.statValue}>{draftCount}</Text>
				<Text style={styles.statLabel}>Draft Sites</Text>
			</Pressable>

			{/* Pending Reviews Card */}
			<Pressable
				style={({pressed}) => [styles.card, pendingReviewsCount > 0 && styles.cardUrgent, pressed && styles.cardPressed]}
				onPress={() => router.push('/admin/pending-reviews')}
			>
				{pendingReviewsCount > 0 && <View style={styles.badgeDot} />}
				<View style={[styles.iconBadge, {backgroundColor: '#fef3c7'}]}>
					<Ionicons name="chatbox-ellipses-outline" size={24} color="#d97706" />
				</View>
				<Text style={styles.statValue}>{pendingReviewsCount}</Text>
				<Text style={styles.statLabel}>Pending Reviews</Text>
			</Pressable>

			{/* Pending Images Card */}
			<Pressable
				style={({pressed}) => [styles.card, pendingImagesCount > 0 && styles.cardUrgent, pressed && styles.cardPressed]}
				onPress={() => router.push('/admin/pending-images')}
			>
				{pendingImagesCount > 0 && <View style={styles.badgeDot} />}
				<View style={[styles.iconBadge, {backgroundColor: '#f3e5f5'}]}>
					<Ionicons name="image-outline" size={24} color="#7b1fa2" />
				</View>
				<Text style={styles.statValue}>{pendingImagesCount}</Text>
				<Text style={styles.statLabel}>Pending Images</Text>
			</Pressable>

			{/* Published Sites Card */}
			<Pressable
				style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
				onPress={() => router.push('/admin/published-point-of-interest')}
			>
				<View style={[styles.iconBadge, {backgroundColor: '#e8f5e9'}]}>
					<Ionicons name="map-outline" size={24} color="#2e7d32" />
				</View>
				<Text style={styles.statValue}>{data?.pointOfInterestsPublished ?? 0}</Text>
				<Text style={styles.statLabel}>Published Sites</Text>
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
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		marginBottom: 24,
	},
	card: {
		flex: 1,
		minWidth: '45%',
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
		position: 'relative',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardUrgent: {
		borderColor: '#f59e0b',
		borderWidth: 1.5,
		backgroundColor: '#fffcf5',
	},
	badgeDot: {
		position: 'absolute',
		top: 12,
		right: 12,
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#ef4444',
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
});
