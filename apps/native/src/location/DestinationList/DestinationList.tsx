import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Pagination, Spinner} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';
import {DestinationCard} from '~/location/DestinationList/DestinationCard';
import {useLocation} from '~/location/state/location/useLocation';

const limit = 20;

export function DestinationList() {
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

	return (
		<View style={styles.container}>
			{/* Main Content */}
			{isNearby && !coords ? (
				<View style={styles.messageCard}>
					<ActivityIndicator size="small" color="#0284c7" />
					<Text style={styles.messageTitle}>Locating Destinations</Text>
					<Text style={styles.messageSubtitle}>Acquiring current GPS coordinates to calculate nearby places...</Text>
				</View>
			) : loading ? (
				<View style={styles.loadingWrapper}>
					<Spinner />
				</View>
			) : !sites || sites.length === 0 ? (
				<View style={styles.messageCard}>
					<MaterialCommunityIcons name="compass-off-outline" size={44} color="#94a3b8" />
					<Text style={styles.messageTitle}>No Destinations Found</Text>
					<Text style={styles.messageSubtitle}>
						{isNearby ? 'No nearby destinations are currently available in this area.' : 'No recently added locations found.'}
					</Text>
				</View>
			) : (
				<>
					<View style={styles.list}>
						{sites.map(site => (
							<DestinationCard key={site.id} site={site} userCoords={coords} />
						))}
					</View>

					<Pagination limit={limit} itemCount={sites.length} />
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 4,
	},
	list: {
		flexDirection: 'column',
		gap: 12,
		marginBottom: 16,
	},
	loadingWrapper: {
		paddingVertical: 48,
		alignItems: 'center',
		justifyContent: 'center',
	},
	messageCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 32,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 16,
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 2,
	},
	messageTitle: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '700',
		marginTop: 12,
		marginBottom: 4,
	},
	messageSubtitle: {
		color: '#64748b',
		fontSize: 13,
		textAlign: 'center',
		maxWidth: 360,
		lineHeight: 18,
	},
});
