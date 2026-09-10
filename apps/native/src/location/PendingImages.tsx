import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function PendingImages() {
	const router = useRouter();
	const authentication = useAuthentication();
	const {data: images, loading} = useApiFetch('location', 'ImageController', 'getPendingImages', {});

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	if (!images || images.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Ionicons name="images-outline" size={48} color="#adb5bd" />
				<Text style={styles.emptyText}>No pending images awaiting moderation.</Text>
			</View>
		);
	}

	return (
		<View style={styles.grid}>
			{images.map(image => (
				<Pressable
					key={image.id}
					style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
					onPress={() => router.push(`/admin/pending-images/${image.id}`)}
				>
					<Image source={{uri: image.url}} style={styles.image} resizeMode="cover" />

					<View style={styles.cardOverlay}>
						<Text style={styles.poiName} numberOfLines={1}>
							{image.pointOfInterest.name}
						</Text>
						<Text style={styles.userName} numberOfLines={1}>
							By {image.user.username || `${image.user.firstName} ${image.user.lastName}`.trim() || 'Anonymous'}
						</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		paddingBottom: 24,
	},
	card: {
		width: '47%',
		aspectRatio: 1,
		backgroundColor: '#1a1a1a',
		borderRadius: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	cardPressed: {
		opacity: 0.8,
		transform: [{scale: 0.98}],
	},
	image: {
		width: '100%',
		height: '100%',
	},
	cardOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.65)',
		padding: 8,
	},
	poiName: {
		fontSize: 13,
		fontWeight: '600',
		color: '#ffffff',
	},
	userName: {
		fontSize: 11,
		color: '#d1d5db',
		marginTop: 2,
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48,
		gap: 12,
	},
	emptyText: {
		fontSize: 14,
		color: '#6c757d',
		textAlign: 'center',
	},
});
