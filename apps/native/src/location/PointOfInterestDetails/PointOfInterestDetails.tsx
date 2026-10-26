import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {Link, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString, ImageView, Spinner} from '@northernexplorer/tools-web';
import {SiteDifficultyEnum, RolesEnum, PublishStatusEnum, RejectionReasonEnum} from '@northernexplorer/types';
import {Reviews} from './components/Reviews';
import {Photos} from './components/Photos';
import {AddNewPointOfInterestFavorite} from './components/AddPointOfInterestFavorite';
import {PhotoPreviewModal} from './components/PhotoPreviewModal';
import {ReviewMetadataBadges} from './components/ReviewMetadataBadges';
import {styles} from '~/location/PointOfInterestDetails/styles';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {Map} from '~/location/PointOfInterestDetails/components/Map';
import {useLocation} from '~/location/state/location/useLocation';

const REJECTION_REASON_LABELS: Record<RejectionReasonEnum, string> = {
	[RejectionReasonEnum.TRESPASSING_REQUIRED]: 'Trespassing Required',
	[RejectionReasonEnum.ECOLOGICALLY_SENSITIVE]: 'Ecologically Sensitive',
	[RejectionReasonEnum.CLOSED_PERMANENTLY]: 'Closed Permanently',
	[RejectionReasonEnum.DUPLICATE]: 'Duplicate',
	[RejectionReasonEnum.OUT_OF_SCOPE]: 'Out of Scope',
};

export function PointOfInterestDetails() {
	const {id} = useLocalSearchParams<{id: string}>();
	const auth = useAuthentication();
	const coords = useLocation();
	const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

	const {data, loading, refetch} = useApiFetch('location', 'PointOfInterestController', 'getById', {id});
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});
	const canAccessExpeditionDifficulty = !!permissionData?.navigation.useExpeditionDifficulty;
	const canAccessOffTrailDifficulty = !!permissionData?.navigation.useOffTrailDifficulty;

	const distance = useMemo(() => {
		if (!coords?.lat || !data?.lon) return null;

		const userLat = typeof coords.lat === 'number' ? coords.lat : parseFloat(String(coords.lat));
		const userLon = typeof coords.lon === 'number' ? coords.lon : parseFloat(String(coords.lon));
		const siteLat = typeof data.lat === 'number' ? data.lat : parseFloat(String(data.lat));
		const siteLon = typeof data.lon === 'number' ? data.lon : parseFloat(String(data.lon));

		if (isNaN(userLat) || isNaN(userLon) || isNaN(siteLat) || isNaN(siteLon)) return null;

		const distInKm = calculateHaversineDistance(userLat, userLon, siteLat, siteLon);

		if (isNaN(distInKm)) return null;

		if (distInKm < 1) {
			return `${Math.round(distInKm * 1000)} m away`;
		}
		return `${distInKm.toFixed(1)} km away`;
	}, [coords?.lat, coords?.lon, data?.lat, data?.lon]);

	if (loading || !data) return <Spinner />;

	// Gate access based on POI difficulty and user permissions
	const isOffTrail = data.difficulty === SiteDifficultyEnum.OFF_TRAIL_REMOTE;
	const isExpedition = data.difficulty === SiteDifficultyEnum.EXPEDITION_ONLY;

	const hasPermission = (!isOffTrail || canAccessOffTrailDifficulty) && (!isExpedition || canAccessExpeditionDifficulty);

	const reviewCount = data.reviews?.length ?? 0;
	const photoCount = data.images?.length ?? 0;
	const rawRating = typeof data.rating === 'number' ? data.rating : parseFloat(String(data.rating));
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;

	return (
		<View>
			<View style={styles.bannerContainer}>
				<Pressable
					onPress={() => {
						if (data.image.id) {
							setSelectedImageId(data.image.id);
						}
					}}
					style={styles.bannerPressable}
					accessibilityRole="button"
					accessibilityLabel="View cover photo"
				>
					<ImageView
						source={{
							uri: getImageUrl({
								path: data.image.url,
								size: 'large',
								cdn: config.CONTENT_DELIVERY_NETWORK,
								processed: data.image.processed,
							}),
						}}
						style={styles.banner}
					/>
				</Pressable>
				<View style={styles.mapCard}>
					<Map site={data} />
				</View>
			</View>
			<View style={styles.content}>
				<View style={styles.headerRow}>
					<Text style={styles.breadcrumbs}>
						{data.country.name} › {data.region.name}
					</Text>
					{auth && (
						<Link
							href={{
								pathname: '/[country]/[region]/[name]/[id]/edit',
								params: {
									country: getUrlSafeString(data.country.name),
									region: getUrlSafeString(data.region.name),
									id: getUrlSafeString(data.id),
									name: getUrlSafeString(data.name),
								},
							}}
							asChild
						>
							<TouchableOpacity style={styles.editButton}>
								<Ionicons
									name={auth.roles?.includes(RolesEnum.Admin) ? 'create-outline' : 'bulb-outline'}
									size={16}
									color="#0088cc"
									style={{marginRight: 4}}
								/>
								<Text style={styles.editButtonText}>{auth.roles?.includes(RolesEnum.Admin) ? 'Edit' : 'Suggest Edit'}</Text>
							</TouchableOpacity>
						</Link>
					)}
					<AddNewPointOfInterestFavorite pointOfInterestId={data.id} />
				</View>

				<Text style={styles.title}>{data.name}</Text>

				{auth?.roles?.includes(RolesEnum.Admin) && data.status === PublishStatusEnum.Rejected && (
					<View style={statusBannerStyles.rejectedContainer}>
						<Text style={statusBannerStyles.rejectedTitle}>Status: Rejected</Text>
						{data.rejectionReason && (
							<Text style={statusBannerStyles.rejectedReason}>
								Reason: {REJECTION_REASON_LABELS[data.rejectionReason] || data.rejectionReason}
							</Text>
						)}
					</View>
				)}
				{auth?.roles?.includes(RolesEnum.Admin) && data.status === PublishStatusEnum.Draft && (
					<View style={statusBannerStyles.draftContainer}>
						<Text style={statusBannerStyles.draftTitle}>Status: Draft</Text>
					</View>
				)}

				{/* 5-Star Rating Summary Row */}
				<View style={ratingStyles.ratingBadge}>
					<View style={ratingStyles.starRow}>
						{[1, 2, 3, 4, 5].map(starIndex => {
							let iconName: 'star' | 'star-half' | 'star-outline' = 'star-outline';

							if (averageRating >= starIndex) {
								iconName = 'star';
							} else if (averageRating >= starIndex - 0.5) {
								iconName = 'star-half';
							}

							const isFilled = iconName !== 'star-outline';

							return <Ionicons key={starIndex} name={iconName} size={18} color={isFilled ? '#f59e0b' : '#cbd5e1'} />;
						})}
					</View>

					{averageRating > 0 ? (
						<>
							<Text style={ratingStyles.ratingScore}>{averageRating.toFixed(1)}</Text>
							<Text style={ratingStyles.ratingCount}>
								({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
							</Text>
						</>
					) : (
						<Text style={ratingStyles.noReviewsText}>No reviews yet</Text>
					)}
				</View>

				{/* Shared System-Generated Metadata Badges & Conditions */}
				<ReviewMetadataBadges difficulty={data.difficulty} entranceCost={data.entranceCost} conditions={data.conditions} />

				{/* Restricted Metadata (Coordinates, Distance, Dates, Organization) */}
				{hasPermission && (
					<View style={styles.metaContainer}>
						<Text style={styles.metaLabel}>
							Coordinates: {data.lat}°, {data.lon}°
						</Text>
						{distance ? <Text style={styles.metaLabel}>Distance: {distance}</Text> : null}
						{(data.startDate || data.endDate) && (
							<Text style={styles.metaLabel}>
								Dates: {data.startDate || 'Unknown'} - {data.endDate || 'Unknown'}
							</Text>
						)}
						<Text style={styles.metaLabel}>Organization: {data.organization.name}</Text>
					</View>
				)}

				<View style={styles.divider} />

				<Text style={styles.body} numberOfLines={hasPermission ? undefined : 3} ellipsizeMode="tail">
					{data.description}
				</Text>

				<View style={styles.divider} />

				{/* Restricted Media & Reviews Sections */}
				{hasPermission ? (
					<>
						{/* Photos Section */}
						<View style={sectionStyles.header}>
							<Ionicons name="images-outline" size={20} color="#0f172a" />
							<Text style={sectionStyles.title}>Photos ({photoCount})</Text>
						</View>
						<Photos data={data} refetch={refetch} selectedImageId={selectedImageId} setSelectedImageId={setSelectedImageId} />

						<View style={styles.divider} />

						{/* Reviews Section */}
						<View style={sectionStyles.header}>
							<Ionicons name="chatbox-ellipses-outline" size={20} color="#0f172a" />
							<Text style={sectionStyles.title}>Reviews ({reviewCount})</Text>
						</View>
						<Reviews data={data} refetch={refetch} />
					</>
				) : (
					<Link href={auth?.username ? `/user/${auth.username}/change-subscription` : '/user/login'} asChild>
						<TouchableOpacity style={restrictedStyles.container}>
							<Ionicons name="lock-closed-outline" size={24} color="#64748b" />
							<Text style={restrictedStyles.title}>Subscriber Access Required</Text>
							<Text style={restrictedStyles.text}>
								You must be an active subscriber to unlock coordinates, community photos, reviews, and detailed expedition info for
								this site.
							</Text>
							<Text style={restrictedStyles.linkText}>Tap to view subscription options</Text>
						</TouchableOpacity>
					</Link>
				)}

				{!hasPermission && selectedImageId && (
					<PhotoPreviewModal
						selectedImageId={selectedImageId}
						selectedIndex={0}
						totalImages={1}
						currentUserId={auth?.userId}
						isAdmin={auth?.roles?.includes(RolesEnum.Admin)}
						onClose={() => setSelectedImageId(null)}
						onPrevious={() => {}}
						onNext={() => {}}
					/>
				)}
			</View>
		</View>
	);
}

const ratingStyles = StyleSheet.create({
	ratingBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 4,
		marginBottom: 8,
	},
	starRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	ratingScore: {
		fontSize: 14,
		fontWeight: '700',
		color: '#0f172a',
		marginLeft: 2,
	},
	ratingCount: {
		fontSize: 13,
		color: '#64748b',
	},
	noReviewsText: {
		fontSize: 13,
		color: '#94a3b8',
		marginLeft: 2,
	},
});

const sectionStyles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
	},
});

const restrictedStyles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		alignItems: 'center',
		gap: 8,
		marginVertical: 12,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#334155',
	},
	text: {
		fontSize: 14,
		color: '#64748b',
		textAlign: 'center',
	},
	linkText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0284c7',
		marginTop: 4,
	},
});

const statusBannerStyles = StyleSheet.create({
	rejectedContainer: {
		backgroundColor: '#fee2e2',
		borderRadius: 10,
		padding: 12,
		marginTop: 8,
		borderWidth: 1,
		borderColor: '#fca5a5',
	},
	rejectedTitle: {
		color: '#991b1b',
		fontWeight: '700',
		fontSize: 14,
	},
	rejectedReason: {
		color: '#b91c1c',
		fontSize: 13,
		marginTop: 4,
	},
	draftContainer: {
		backgroundColor: '#fef3c7',
		borderRadius: 10,
		padding: 12,
		marginTop: 8,
		borderWidth: 1,
		borderColor: '#fcd34d',
	},
	draftTitle: {
		color: '#92400e',
		fontWeight: '700',
		fontSize: 14,
	},
});
