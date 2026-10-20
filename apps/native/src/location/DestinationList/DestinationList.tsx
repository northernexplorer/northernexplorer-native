import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {getUrlSafeString, getImageUrl, ImageView, Table, Column, Pagination, Spinner, calculateHaversineDistance} from '@northernexplorer/tools-web';
import {PointOfInterestType} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useLocation} from '~/location/state/location/useLocation';
import {config} from '~/config';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';

const limit = 20;

export function DestinationList() {
	const router = useRouter();
	const params = useLocalSearchParams<{sort?: 'nearby' | 'newest'; page?: string}>();
	const currentSort = params.sort === 'newest' ? 'newest' : 'nearby';
	const page = params.page ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
	const offset = (page - 1) * limit;

	const coords = useLocation();

	const isNearby = currentSort === 'nearby';

	const {data: nearbySites, loading: loadingNearby} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearby',
		isNearby && coords ? {lat: coords.lat, lon: coords.lon, limit, offset} : null,
	);

	const {data: newestSites, loading: loadingNewest} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNewest',
		!isNearby ? {limit, offset} : null,
	);

	const sites = isNearby ? nearbySites : newestSites;
	const loading = isNearby ? loadingNearby : loadingNewest;

	const columns: Column<PointOfInterestType>[] = useMemo(
		() => [
			{
				key: 'image',
				title: '',
				width: 54,
				render: site => (
					<ImageView
						source={{
							uri: getImageUrl({
								path: site.image.url,
								size: 'thumbnail',
								cdn: config.CONTENT_DELIVERY_NETWORK,
								processed: site.image.processed,
							}),
						}}
						style={styles.thumbnail}
					/>
				),
			},
			{
				key: 'name',
				title: 'Name',
				flex: 3,
				render: site => (
					<View style={{paddingRight: 12}}>
						<Text style={styles.siteName} numberOfLines={1}>
							{site.name}
						</Text>
						<Text style={styles.siteDescription} numberOfLines={1}>
							{site.description || 'No description available'}
						</Text>
					</View>
				),
			},
			{
				key: 'region',
				title: 'Location',
				flex: 2,
				render: site => {
					let distanceText: string | null = null;
					if (coords) {
						const dist = calculateHaversineDistance(Number(coords.lat), Number(coords.lon), Number(site.lat), Number(site.lon));
						if (!isNaN(dist)) {
							distanceText = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
						}
					}

					return (
						<View style={{paddingRight: 12}}>
							<Text style={styles.cellText} numberOfLines={1}>
								{site.region.name}
							</Text>
							<Text style={styles.cellSubtext} numberOfLines={1}>
								{site.country.name}
								{distanceText ? ` • ${distanceText}` : ''}
							</Text>
						</View>
					);
				},
			},
			{
				key: 'details',
				title: 'Details',
				flex: 2,
				render: site => {
					const rawRating = site.rating ? (typeof site.rating === 'number' ? site.rating : parseFloat(String(site.rating))) : 0;
					const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
					const reviewCount = site.reviews?.length ?? 0;
					const diffConfig = site.difficulty ? DIFFICULTY_CONFIG[site.difficulty] : null;

					return (
						<View style={styles.detailsCell}>
							{averageRating > 0 ? (
								<View style={styles.ratingRow}>
									<Ionicons name="star" size={12} color="#f59e0b" />
									<Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
									<Text style={styles.countText}>({reviewCount})</Text>
								</View>
							) : (
								<Text style={styles.noReviewsText}>No reviews</Text>
							)}

							{diffConfig && (
								<View style={[styles.difficultyBadge, {backgroundColor: diffConfig.bgColor}]}>
									<Text style={[styles.difficultyText, {color: diffConfig.color}]}>{diffConfig.label.split(' ')[0]}</Text>
								</View>
							)}
						</View>
					);
				},
			},
			{
				key: 'action',
				width: 30,
				align: 'right',
				render: () => <Ionicons name="chevron-forward" size={18} color="#adb5bd" />,
			},
		],
		[coords],
	);

	return (
		<View style={styles.container}>
			{/* Main Content List */}
			{isNearby && !coords ? (
				<View style={styles.loadingWrapper}>
					<ActivityIndicator size="small" color="#ffffff" />
					<Text style={styles.loadingText}>Acquiring location for nearby destinations...</Text>
				</View>
			) : loading ? (
				<Spinner />
			) : (
				<>
					<Table
						data={sites}
						columns={columns}
						keyExtractor={site => site.id}
						emptyText={isNearby ? 'No nearby destinations found.' : 'No newest locations found.'}
						emptyIcon="map-outline"
						onRowPress={site =>
							router.push(
								`/${getUrlSafeString(site.country.name)}/${getUrlSafeString(site.region.name)}/${getUrlSafeString(site.name)}/${site.id}`,
							)
						}
					/>
					<Pagination limit={limit} itemCount={sites?.length || 0} />
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	thumbnail: {
		width: 42,
		height: 42,
		borderRadius: 8,
	},
	siteName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#212529',
	},
	siteDescription: {
		fontSize: 12,
		color: '#6c757d',
		marginTop: 2,
	},
	cellText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#343a40',
	},
	cellSubtext: {
		fontSize: 11,
		color: '#868e96',
		marginTop: 1,
	},
	detailsCell: {
		flexDirection: 'column',
		gap: 4,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
	},
	ratingText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#212529',
	},
	countText: {
		fontSize: 10,
		color: '#868e96',
	},
	noReviewsText: {
		fontSize: 11,
		color: '#adb5bd',
		fontStyle: 'italic',
	},
	difficultyBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	difficultyText: {
		fontSize: 9,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	loadingWrapper: {
		padding: 32,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	loadingText: {
		color: '#94a3b8',
		fontSize: 13,
	},
});
