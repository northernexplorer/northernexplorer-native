import React, {useMemo} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Link, useLocalSearchParams} from 'expo-router';
import {calculateHaversineDistance, getImageUrl, getUrlSafeString, Spinner} from '@northernexplorer/tools';
import {RolesEnum} from '@northernexplorer/types';
import {ReviewDetails} from './components/Reviews';
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
				<ReviewDetails data={data} loading={loading} refetch={refetch} />
			</View>
		</View>
	);
}
