import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Pressable, useWindowDimensions} from 'react-native';
import {Link} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString, ImageView} from '@northernexplorer/tools-web';
import {PointOfInterestType} from '@northernexplorer/types';
import {config} from '~/config';
import {CONDITION_ICON_MAP, COST_LABEL_MAP, DIFFICULTY_CONFIG, formatEnumLabel} from '~/location/PointOfInterestDetails/components/reviewOptions';

type Props = {
	site: PointOfInterestType;
	userCoords: {lat: number | string; lon: number | string} | null;
};

const getRatingLabel = (rating: number): string | null => {
	if (rating >= 4.5) return 'Excellent';
	if (rating >= 3.5) return 'Good';
	if (rating >= 2.5) return 'Average';
	if (rating >= 1.5) return 'Poor';
	if (rating >= 0.5) return 'Terrible';
	return null;
};

export function DestinationCard({site, userCoords}: Props) {
	const {width} = useWindowDimensions();
	const isCompact = width < 600;

	const distance = useMemo(() => {
		if (!userCoords) return null;
		if (!userCoords.lat || !userCoords.lon) return null;
		const userLat = Number(userCoords.lat);
		const userLon = Number(userCoords.lon);
		const siteLat = Number(site.lat);
		const siteLon = Number(site.lon);

		if (isNaN(userLat) || isNaN(userLon) || isNaN(siteLat) || isNaN(siteLon)) {
			return null;
		}

		const distInKm = calculateHaversineDistance(userLat, userLon, siteLat, siteLon);
		if (isNaN(distInKm)) return null;

		if (distInKm < 1) {
			return `${Math.round(distInKm * 1000)} m away`;
		}
		return `${distInKm.toFixed(1)} km away`;
	}, [userCoords, site.lat, site.lon]);

	const rawRating = site.rating ? (typeof site.rating === 'number' ? site.rating : parseFloat(String(site.rating))) : 0;
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
	const ratingLabel = averageRating > 0 ? getRatingLabel(averageRating) : null;
	const reviewCount = site.reviews?.length ?? 0;
	const difficultyInfo = site.difficulty ? DIFFICULTY_CONFIG[site.difficulty] : null;
	const costText = site.entranceCost ? COST_LABEL_MAP[site.entranceCost].badge : null;
	const conditionList = site.conditions ?? [];
	const latestReviewWithText = site.reviews?.find(r => r.description && r.description.trim().length > 0);

	return (
		<Link
			href={{
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(site.country.name),
					region: getUrlSafeString(site.region.name),
					id: getUrlSafeString(site.id),
					name: getUrlSafeString(site.name),
				},
			}}
			asChild
		>
			<Pressable style={({pressed}) => [styles.cardContainer, pressed && styles.cardPressed]}>
				<View style={[styles.card, isCompact && styles.cardCompact]}>
					{/* Left Image Section */}
					<View style={[styles.imageWrapper, isCompact && styles.imageWrapperCompact]}>
						<ImageView
							source={{
								uri: getImageUrl({
									path: site.image.url,
									cdn: config.CONTENT_DELIVERY_NETWORK,
									processed: site.image.processed,
									size: 'thumbnail',
								}),
							}}
							style={styles.image}
						/>
						{difficultyInfo && (
							<View
								style={[
									styles.imageDifficultyBadge,
									{backgroundColor: difficultyInfo.bgColor, borderColor: difficultyInfo.borderColor},
								]}
							>
								<Text style={[styles.imageDifficultyText, {color: difficultyInfo.color}]}>{difficultyInfo.label.split(' ')[0]}</Text>
							</View>
						)}
					</View>

					{/* Right Summary Section */}
					<View style={styles.summaryContainer}>
						<View>
							{/* Location & Distance Header */}
							<View style={styles.locationHeaderRow}>
								<View style={styles.locationBadge}>
									<MaterialCommunityIcons name="map-marker" size={13} color="#0284c7" />
									<Text style={styles.locationText} numberOfLines={1}>
										{site.region.name}, {site.country.name}
									</Text>
								</View>
								{distance && (
									<View style={styles.distanceBadge}>
										<MaterialCommunityIcons name="navigation-variant-outline" size={12} color="#0369a1" />
										<Text style={styles.distanceText}>{distance}</Text>
									</View>
								)}
							</View>

							{/* Title */}
							<Text style={styles.title} numberOfLines={1}>
								{site.name}
							</Text>

							{/* Description */}
							{site.description ? (
								<Text style={styles.description} numberOfLines={2}>
									{site.description}
								</Text>
							) : null}
						</View>

						{/* Review Details & Metadata Section */}
						<View style={styles.reviewDetailsContainer}>
							{/* Ratings Row */}
							<View style={styles.ratingRow}>
								{averageRating > 0 ? (
									<>
										<View style={styles.starsContainer}>
											<Ionicons name="star" size={14} color="#f59e0b" />
											<Text style={styles.ratingScore}>{averageRating.toFixed(1)}</Text>
										</View>
										{ratingLabel && <Text style={styles.ratingLabel}>{ratingLabel}</Text>}
										<Text style={styles.reviewCount}>
											({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
										</Text>
									</>
								) : (
									<View style={styles.noRatingContainer}>
										<Ionicons name="star-outline" size={13} color="#94a3b8" />
										<Text style={styles.noRatingText}>No reviews yet</Text>
									</View>
								)}
							</View>

							{/* Metadata Badges Row (Difficulty, Cost, Conditions) */}
							<View style={styles.badgesRow}>
								{difficultyInfo && (
									<View style={[styles.badge, {backgroundColor: difficultyInfo.bgColor, borderColor: difficultyInfo.borderColor}]}>
										<Text style={[styles.badgeText, {color: difficultyInfo.color}]}>{difficultyInfo.label}</Text>
									</View>
								)}

								{costText && (
									<View style={[styles.badge, styles.costBadge]}>
										<Ionicons name="cash-outline" size={12} color="#047857" />
										<Text style={[styles.badgeText, styles.costBadgeText]}>{costText}</Text>
									</View>
								)}

								{conditionList.slice(0, 2).map(cond => (
									<View key={cond} style={styles.conditionTag}>
										<Ionicons name={CONDITION_ICON_MAP[cond]} size={11} color="#c2410c" />
										<Text style={styles.conditionTagText}>{formatEnumLabel(cond)}</Text>
									</View>
								))}
							</View>

							{/* Review Quote Highlight if available */}
							{latestReviewWithText && (
								<View style={styles.reviewQuoteContainer}>
									<Ionicons name="chatbox-ellipses-outline" size={12} color="#64748b" style={styles.quoteIcon} />
									<Text style={styles.reviewQuoteText} numberOfLines={1}>
										"{latestReviewWithText.description}"
									</Text>
								</View>
							)}
						</View>

						{/* Card Footer / Action */}
						<View style={styles.footerRow}>
							<View style={styles.viewDetailsContainer}>
								<Text style={styles.viewDetailsText}>View Destination</Text>
								<Ionicons name="arrow-forward" size={14} color="#0284c7" />
							</View>
						</View>
					</View>
				</View>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		width: '100%',
		marginBottom: 12,
	},
	cardPressed: {
		opacity: 0.92,
		transform: [{scale: 0.998}],
	},
	card: {
		flexDirection: 'row',
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
		minHeight: 180,
	},
	cardCompact: {
		flexDirection: 'column',
	},
	imageWrapper: {
		width: 220,
		minHeight: 180,
		position: 'relative',
		backgroundColor: '#f1f5f9',
	},
	imageWrapperCompact: {
		width: '100%',
		height: 180,
		minHeight: 180,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	imageDifficultyBadge: {
		position: 'absolute',
		top: 10,
		left: 10,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	imageDifficultyText: {
		fontSize: 10,
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	summaryContainer: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
		gap: 10,
	},
	locationHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 6,
		flexWrap: 'wrap',
		gap: 6,
	},
	locationBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		flexShrink: 1,
	},
	locationText: {
		color: '#0284c7',
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.4,
	},
	distanceBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
		backgroundColor: '#f0f9ff',
		borderWidth: 1,
		borderColor: '#bae6fd',
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 12,
	},
	distanceText: {
		color: '#0369a1',
		fontSize: 11,
		fontWeight: '600',
	},
	title: {
		color: '#0f172a',
		fontSize: 18,
		fontWeight: '700',
		lineHeight: 24,
		marginBottom: 4,
	},
	description: {
		color: '#475569',
		fontSize: 13,
		lineHeight: 18,
	},
	reviewDetailsContainer: {
		marginTop: 4,
		gap: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 6,
	},
	starsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
	},
	ratingScore: {
		color: '#0f172a',
		fontSize: 13,
		fontWeight: '700',
	},
	ratingLabel: {
		color: '#15803d',
		fontSize: 12,
		fontWeight: '600',
	},
	reviewCount: {
		color: '#64748b',
		fontSize: 12,
		fontWeight: '400',
	},
	noRatingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	noRatingText: {
		color: '#94a3b8',
		fontSize: 12,
		fontStyle: 'italic',
	},
	badgesRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 6,
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '700',
	},
	costBadge: {
		backgroundColor: '#d1fae5',
		borderColor: '#a7f3d0',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
	},
	costBadgeText: {
		color: '#047857',
		fontSize: 11,
		fontWeight: '700',
	},
	conditionTag: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
		backgroundColor: '#ffedd5',
		borderWidth: 1,
		borderColor: '#fed7aa',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	conditionTagText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#c2410c',
	},
	reviewQuoteContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderLeftWidth: 2,
		borderLeftColor: '#cbd5e1',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		gap: 6,
	},
	quoteIcon: {
		marginTop: 1,
	},
	reviewQuoteText: {
		flex: 1,
		color: '#475569',
		fontSize: 12,
		fontStyle: 'italic',
	},
	footerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
		paddingTop: 6,
	},
	directionsButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 4,
		paddingHorizontal: 8,
		backgroundColor: '#f0f9ff',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#bae6fd',
	},
	directionsButtonText: {
		color: '#0284c7',
		fontSize: 12,
		fontWeight: '600',
	},
	viewDetailsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginLeft: 'auto',
	},
	viewDetailsText: {
		color: '#0284c7',
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 0.2,
	},
});
