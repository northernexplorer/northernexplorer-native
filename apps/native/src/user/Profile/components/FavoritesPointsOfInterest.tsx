import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Link} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString, ImageView, Spinner} from '@northernexplorer/tools-web';
import {SiteDifficultyEnum} from '@northernexplorer/types';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {useLocation} from '~/location/state/location/useLocation';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';
import {alertStore} from '~/core/alertStore';

export function FavoritePointsOfInterest() {
	const {width} = useWindowDimensions();
	const coords = useLocation();
	const {data, loading, refetch} = useApiFetch('location', 'PointOfInterestController', 'getPointOfInterestFavorites', {});
	const {mutate: unfavoriteMutation} = useApiMutation('location', 'PointOfInterestController', 'unmarkPointOfInterestFavorite');
	const [removingId, setRemovingId] = useState<string | null>(null);

	const isTwoColumns = width >= 640;

	const handleRemoveFavorite = (poiId: string, poiName: string) => {
		alertStore.showAlert({
			type: 'warning',
			title: 'Remove Favorite',
			message: `Remove "${poiName}" from your saved favorites?`,
			buttons: [
				{
					text: 'Remove',
					style: 'destructive',
					onPress: async () => {
						setRemovingId(poiId);
						try {
							await unfavoriteMutation({id: poiId});
							await refetch();
						} catch {
							alertStore.showAlert({
								type: 'error',
								title: 'Error',
								message: 'Failed to remove favorite. Please try again.',
							});
						} finally {
							setRemovingId(null);
						}
					},
				},
				{
					text: 'Cancel',
					style: 'cancel',
				},
			],
		});
	};

	const calculateDistance = (lat: number | string, lon: number | string) => {
		if (!coords) return null;
		if (!coords.lat || !coords.lon) return null;
		const userLat = Number(coords.lat);
		const userLon = Number(coords.lon);
		const siteLat = Number(lat);
		const siteLon = Number(lon);

		if (isNaN(userLat) || isNaN(userLon) || isNaN(siteLat) || isNaN(siteLon)) {
			return null;
		}

		const distInKm = calculateHaversineDistance(userLat, userLon, siteLat, siteLon);
		if (isNaN(distInKm)) return null;

		if (distInKm < 1) {
			return `${Math.round(distInKm * 1000)} m away`;
		}
		return `${distInKm.toFixed(1)} km away`;
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<Spinner />
			</View>
		);
	}

	const favorites = data ?? [];

	if (favorites.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<View style={styles.emptyIconCircle}>
					<Ionicons name="heart-outline" size={38} color="#0284c7" />
				</View>
				<Text style={styles.emptyTitle}>No Saved Favorites Yet</Text>
				<Text style={styles.emptySubtitle}>
					When you find destinations you love or want to explore later, tap the star icon to save them here for quick access.
				</Text>
				<Link href="/destinations" asChild>
					<Pressable style={({pressed}) => [styles.exploreButton, pressed && styles.exploreButtonPressed]}>
						<Ionicons name="compass-outline" size={18} color="#ffffff" style={styles.buttonIcon} />
						<Text style={styles.exploreButtonText}>Explore Destinations</Text>
					</Pressable>
				</Link>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header info bar */}
			<View style={styles.headerRow}>
				<View>
					<Text style={styles.sectionTitle}>Favorite Destinations</Text>
					<Text style={styles.sectionSubtitle}>Places you saved to visit and explore</Text>
				</View>
				<View style={styles.countBadge}>
					<Ionicons name="star" size={13} color="#b45309" />
					<Text style={styles.countBadgeText}>
						{favorites.length} {favorites.length === 1 ? 'place' : 'places'}
					</Text>
				</View>
			</View>

			{/* Cards list / grid */}
			<View style={[styles.grid, isTwoColumns && styles.gridTwoColumns]}>
				{favorites.map(favorite => {
					const poi = favorite.pointOfInterest;
					const countryName = poi.country;
					const regionName = poi.region;
					const difficultyInfo = poi.difficulty ? DIFFICULTY_CONFIG[poi.difficulty as SiteDifficultyEnum] : null;
					const distanceText = calculateDistance(poi.lat, poi.lon);
					const rawRating = poi.rating ? (typeof poi.rating === 'number' ? poi.rating : parseFloat(String(poi.rating))) : 0;
					const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
					const isCurrentlyRemoving = removingId === poi.id;

					return (
						<View key={favorite.id} style={[styles.cardWrapper, isTwoColumns && styles.cardWrapperTwoColumns]}>
							<Link
								href={{
									pathname: '/[country]/[region]/[name]/[id]',
									params: {
										country: getUrlSafeString(countryName),
										region: getUrlSafeString(regionName),
										id: getUrlSafeString(poi.id),
										name: getUrlSafeString(poi.name),
									},
								}}
								asChild
							>
								<Pressable style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
									{/* Card Image Cover */}
									<View style={styles.imageContainer}>
										<ImageView
											source={{
												uri: getImageUrl({
													path: favorite.image.url,
													cdn: config.CONTENT_DELIVERY_NETWORK,
													processed: favorite.image.processed,
													size: 'thumbnail',
												}),
											}}
											style={styles.cardImage}
										/>

										{/* Difficulty Badge */}
										{difficultyInfo && (
											<View
												style={[
													styles.difficultyBadge,
													{
														backgroundColor: difficultyInfo.bgColor,
														borderColor: difficultyInfo.borderColor,
													},
												]}
											>
												<Text style={styles.difficultyText}>{difficultyInfo.label.split(' ')[0]}</Text>
											</View>
										)}

										{/* Rating Badge */}
										{averageRating > 0 && (
											<View style={styles.ratingBadge}>
												<Ionicons name="star" size={12} color="#f59e0b" />
												<Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
											</View>
										)}

										{/* Unfavorite Button */}
										<Pressable
											onPress={e => {
												e.stopPropagation();
												handleRemoveFavorite(poi.id, poi.name);
											}}
											style={({pressed}) => [styles.favoriteActionButton, pressed && styles.favoriteActionButtonPressed]}
											hitSlop={8}
											accessibilityRole="button"
											accessibilityLabel={`Remove ${poi.name} from favorites`}
										>
											{isCurrentlyRemoving ? (
												<ActivityIndicator size="small" color="#ef4444" />
											) : (
												<Ionicons name="star" size={18} color="#f59e0b" />
											)}
										</Pressable>
									</View>

									{/* Card Content */}
									<View style={styles.cardContent}>
										{/* Location row */}
										<View style={styles.locationRow}>
											<MaterialCommunityIcons name="map-marker" size={14} color="#0284c7" />
											<Text style={styles.locationText} numberOfLines={1}>
												{regionName ? `${regionName}, ` : ''}
												{countryName}
											</Text>
										</View>

										{/* Title */}
										<Text style={styles.cardTitle} numberOfLines={1}>
											{poi.name}
										</Text>

										{/* Distance tag if available */}
										{distanceText && (
											<View style={styles.distanceRow}>
												<MaterialCommunityIcons name="navigation-variant-outline" size={12} color="#0369a1" />
												<Text style={styles.distanceText}>{distanceText}</Text>
											</View>
										)}

										{/* Description snippet */}
										{poi.description ? (
											<Text style={styles.cardDescription} numberOfLines={2}>
												{poi.description}
											</Text>
										) : null}

										{/* Card Footer */}
										<View style={styles.cardFooter}>
											<Text style={styles.viewDetailsText}>View Destination</Text>
											<Ionicons name="arrow-forward" size={14} color="#0284c7" />
										</View>
									</View>
								</Pressable>
							</Link>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 8,
	},
	loadingContainer: {
		paddingVertical: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 18,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 2,
	},
	sectionSubtitle: {
		fontSize: 13,
		color: '#64748b',
	},
	countBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		backgroundColor: '#fffbeb',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#fde68a',
	},
	countBadgeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#92400e',
	},
	emptyContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 24,
		paddingVertical: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 12,
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 2,
	},
	emptyIconCircle: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: '#f0f9ff',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#bae6fd',
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 8,
		textAlign: 'center',
	},
	emptySubtitle: {
		fontSize: 14,
		color: '#64748b',
		textAlign: 'center',
		lineHeight: 21,
		maxWidth: 420,
		marginBottom: 24,
	},
	exploreButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#0284c7',
		paddingVertical: 12,
		paddingHorizontal: 22,
		borderRadius: 10,
		shadowColor: '#0284c7',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	exploreButtonPressed: {
		opacity: 0.85,
		transform: [{scale: 0.98}],
	},
	buttonIcon: {
		marginRight: 8,
	},
	exploreButtonText: {
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '600',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	gridTwoColumns: {
		justifyContent: 'flex-start',
	},
	cardWrapper: {
		width: '100%',
	},
	cardWrapperTwoColumns: {
		width: 'calc(50% - 8px)' as unknown as number,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		overflow: 'hidden',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.05,
		shadowRadius: 6,
		elevation: 2,
	},
	cardPressed: {
		opacity: 0.92,
		transform: [{scale: 0.99}],
	},
	imageContainer: {
		position: 'relative',
		width: '100%',
		height: 170,
		backgroundColor: '#f1f5f9',
	},
	cardImage: {
		width: '100%',
		height: '100%',
	},
	difficultyBadge: {
		position: 'absolute',
		top: 10,
		left: 10,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
		zIndex: 2,
	},
	difficultyText: {
		color: '#ffffff',
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 0.3,
	},
	ratingBadge: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: 'rgba(15, 23, 42, 0.82)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		zIndex: 2,
	},
	ratingText: {
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '700',
	},
	favoriteActionButton: {
		position: 'absolute',
		top: 10,
		right: 10,
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 3,
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	favoriteActionButtonPressed: {
		transform: [{scale: 0.9}],
		backgroundColor: '#fef3c7',
	},
	cardContent: {
		padding: 14,
		gap: 6,
	},
	locationRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	locationText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0284c7',
		flex: 1,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0f172a',
		lineHeight: 22,
	},
	distanceRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	distanceText: {
		fontSize: 12,
		color: '#0369a1',
		fontWeight: '500',
	},
	cardDescription: {
		fontSize: 13,
		color: '#64748b',
		lineHeight: 18,
		marginTop: 2,
	},
	cardFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
	},
	viewDetailsText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#0284c7',
	},
});
