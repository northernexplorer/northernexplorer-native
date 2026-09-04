import React, {useMemo} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Link, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString, Spinner} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {Reviews} from './components/Reviews';
import {Photos} from './components/Photos';
import {styles} from '~/location/PointOfInterestDetails/styles';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {Map} from '~/location/PointOfInterestDetails/components/Map';
import {useLocation} from '~/location/state/location/useLocation';

export function PointOfInterestDetails() {
	const {id} = useLocalSearchParams<{id: string}>();
	const auth = useAuthentication();
	const coords = useLocation();

	const {data, loading, refetch} = useApiFetch('location', 'PointOfInterestController', 'getPointOfInterestById', {id});

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

	const reviewCount = data.reviews?.length ?? 0;
	const photoCount = data.images?.length ?? 0;
	const rawRating = typeof data.averageRating === 'number' ? data.averageRating : parseFloat(String(data.averageRating));
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;

	return (
		<View>
			<View style={styles.bannerContainer}>
				<Image source={{uri: getImageUrl({path: data.image, cdn: config.CONTENT_DELIVERY_NETWORK})}} style={styles.banner} />
				<View style={styles.mapCard}>
					<Map site={data} />
				</View>
			</View>
			<View style={styles.content}>
				<View style={styles.headerRow}>
					<Text style={styles.breadcrumbs}>
						{data.country.name} › {data.region.name}
					</Text>
					{auth?.roles?.includes(RolesEnum.Admin) && (
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
								<Text style={styles.editButtonText}>Edit</Text>
							</TouchableOpacity>
						</Link>
					)}
				</View>

				<Text style={styles.title}>{data.name}</Text>

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

				<View style={styles.metaContainer}>
					<Text style={styles.metaLabel}>
						Coordinates: {data.lat}°, {data.lon}°
					</Text>
					{distance ? <Text style={styles.metaLabel}>Distance: {distance}</Text> : null}
					<Text style={styles.metaLabel}>
						Dates: {data.startDate || 'Unknown'} - {data.endDate || 'Unknown'}
					</Text>
					<Text style={styles.metaLabel}>Organization: {data.organization.name}</Text>
				</View>

				<View style={styles.divider} />

				<Text style={styles.body}>{data.description}</Text>

				<View style={styles.divider} />

				{/* Photos Section */}
				<View style={sectionStyles.header}>
					<Ionicons name="images-outline" size={20} color="#0f172a" />
					<Text style={sectionStyles.title}>Photos ({photoCount})</Text>
				</View>
				<Photos data={data} loading={loading} refetch={refetch} />

				<View style={styles.divider} />

				{/* Reviews Section */}
				<View style={sectionStyles.header}>
					<Ionicons name="chatbox-ellipses-outline" size={20} color="#0f172a" />
					<Text style={sectionStyles.title}>Reviews ({reviewCount})</Text>
				</View>
				<Reviews data={data} loading={loading} refetch={refetch} />
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
