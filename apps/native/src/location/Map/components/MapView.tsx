import React, {useRef, useCallback} from 'react';
import {View, Text, StyleSheet, Image, NativeSyntheticEvent} from 'react-native';
import {Map as NativeMap, Camera, Marker, CameraRef, ViewStateChangeEvent} from '@maplibre/maplibre-react-native';
import {useRouter} from 'expo-router';
import {getImageUrl, getUrlSafeString} from '@northernexplorer/tools-web';
import {PointOfInterestType} from '@northernexplorer/types';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {BBox} from 'geojson';
import Supercluster from 'supercluster';
import {MapViewProps} from '../Map';
import {config} from '~/config';
import {MapMarkerNative} from '~/location/Map/components/MapMarkerNative';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';

export function MapView({
	baseLayer,
	clusters,
	supercluster,
	selectedSite,
	setSelectedSite,
	userMarker,
	setUserMarker,
	coords,
	initialLat,
	initialLon,
	initialZoom,
	canAccessOffTrailDifficulty,
	canAccessExpeditionDifficulty,
	isSelectedLocked,
	updateMapCenterAndBounds,
}: MapViewProps) {
	const router = useRouter();
	const cameraRef = useRef<CameraRef>(null);

	const onRegionDidChange = useCallback(
		(e: NativeSyntheticEvent<ViewStateChangeEvent>) => {
			const {bounds, zoom, center} = e.nativeEvent;
			if (!Array.isArray(bounds)) return;

			const nextBounds: BBox = [bounds[0], bounds[1], bounds[2], bounds[3]];
			let lat = 0;
			let lon = 0;

			if (Array.isArray(center)) {
				[lon, lat] = center;
			} else if (typeof center === 'object' && 'latitude' in center && 'longitude' in center) {
				lat = (center as {latitude: number; longitude: number}).latitude;
				lon = (center as {latitude: number; longitude: number}).longitude;
			} else {
				lon = (bounds[0] + bounds[2]) / 2;
				lat = (bounds[1] + bounds[3]) / 2;
			}

			updateMapCenterAndBounds(nextBounds, zoom, {lat, lon});
		},
		[updateMapCenterAndBounds],
	);

	const handleNavigateToSite = useCallback(
		(site: PointOfInterestType) => {
			router.push({
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(site.country.name),
					region: getUrlSafeString(site.region.name),
					id: getUrlSafeString(site.id),
					name: getUrlSafeString(site.name),
				},
			});
		},
		[router],
	);

	const rawRating = selectedSite?.rating
		? typeof selectedSite.rating === 'number'
			? selectedSite.rating
			: parseFloat(String(selectedSite.rating))
		: 0;
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
	const reviewCount = selectedSite?.reviews?.length ?? 0;
	const difficultyInfo = selectedSite?.difficulty ? DIFFICULTY_CONFIG[selectedSite.difficulty] : null;

	return (
		<View style={{flex: 1}}>
			<NativeMap
				style={{width: '100%', height: '100%'}}
				mapStyle={baseLayer}
				onRegionDidChange={onRegionDidChange}
				onPress={() => {
					if (selectedSite) setSelectedSite(null);
					if (userMarker) setUserMarker(false);
				}}
			>
				<Camera ref={cameraRef} zoom={initialZoom} center={[initialLon, initialLat]} />

				{clusters.map(cluster => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const isCluster = cluster.properties && 'cluster' in cluster.properties && cluster.properties.cluster;

					if (isCluster) {
						const clusterFeature = cluster as Supercluster.ClusterFeature<Supercluster.AnyProps>;
						const clusterId = clusterFeature.id as number;
						const pointCount = clusterFeature.properties.point_count;

						return (
							<Marker
								key={`cluster-${clusterId}`}
								lngLat={[longitude, latitude]}
								anchor="center"
								onPress={() => {
									if (!supercluster || clusterId === undefined) return;
									const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 20);
									cameraRef.current?.flyTo({
										center: [longitude, latitude],
										zoom: expansionZoom,
										duration: 500,
									});
								}}
							>
								<View style={styles.clusterMarker}>
									<Text style={styles.clusterText}>{pointCount}</Text>
								</View>
							</Marker>
						);
					}

					const site = cluster.properties.site;
					if (!site) return null;

					return (
						<MapMarkerNative
							key={site.id}
							site={site}
							longitude={longitude}
							latitude={latitude}
							selectedSite={selectedSite}
							setSelectedSite={setSelectedSite}
							image={site.image}
							difficulty={site.difficulty}
							canAccessOffTrailDifficulty={canAccessOffTrailDifficulty}
							canAccessExpeditionDifficulty={canAccessExpeditionDifficulty}
						/>
					);
				})}

				{selectedSite && (
					<Marker
						key={`popup-${selectedSite.id}`}
						lngLat={[selectedSite.lon, selectedSite.lat]}
						anchor="bottom"
						offset={[0, -65]}
						onPress={() => {
							if (!isSelectedLocked) {
								handleNavigateToSite(selectedSite);
							}
						}}
					>
						{isSelectedLocked ? (
							<View style={styles.lockedPopupContainer}>
								<MaterialCommunityIcons name="lock" size={24} color="#e67e22" />
								<Text style={styles.lockedPopupTitle}>Restricted Access</Text>
								<Text style={styles.lockedPopupSubtext}>Sign in or upgrade your account to view details for this location.</Text>
								<View style={styles.popupArrow} />
							</View>
						) : (
							<View style={styles.popupContainer}>
								<Image
									source={{
										uri: getImageUrl({
											path: selectedSite.image.url,
											cdn: config.CONTENT_DELIVERY_NETWORK,
											processed: selectedSite.image.processed,
											size: 'thumbnail',
										}),
									}}
									style={styles.popupImage}
								/>

								<View style={styles.popupContent}>
									<Text style={styles.popupTitle}>{selectedSite.name}</Text>

									<View style={popupMetaStyles.metaRow}>
										{averageRating > 0 ? (
											<View style={popupMetaStyles.ratingRow}>
												<Ionicons name="star" size={12} color="#f59e0b" />
												<Text style={popupMetaStyles.ratingText}>{averageRating.toFixed(1)}</Text>
												<Text style={popupMetaStyles.countText}>({reviewCount})</Text>
											</View>
										) : (
											<Text style={popupMetaStyles.noReviewsText}>No reviews</Text>
										)}

										{difficultyInfo && (
											<View style={[popupMetaStyles.difficultyBadge, {backgroundColor: difficultyInfo.bgColor}]}>
												<Text style={[popupMetaStyles.difficultyText, {color: difficultyInfo.color}]}>
													{difficultyInfo.label.split(' ')[0]}
												</Text>
											</View>
										)}
									</View>

									<Text style={styles.popupDescription} numberOfLines={4} ellipsizeMode="tail">
										{selectedSite.description}
									</Text>
								</View>

								<View style={styles.popupArrow} />
							</View>
						)}
					</Marker>
				)}

				{coords && (
					<>
						<Marker
							onPress={e => {
								e.stopPropagation();
								setUserMarker(prev => !prev);
								setSelectedSite(null);
							}}
							lngLat={[coords.lon, coords.lat]}
							anchor="bottom"
						>
							<View style={styles.locationPin}>
								<View style={styles.locationPinCenter} />
							</View>
						</Marker>

						{userMarker && (
							<Marker lngLat={[coords.lon, coords.lat]} anchor="bottom" offset={[0, -45]}>
								<View style={styles.popupContainer}>
									<Text style={styles.popupTitle}>Your Location</Text>
									<Text style={styles.popupDescription}>{coords.lat}</Text>
									<Text style={styles.popupDescription}>{coords.lon}</Text>
									<View style={styles.popupArrow} />
								</View>
							</Marker>
						)}
					</>
				)}
			</NativeMap>
		</View>
	);
}

const popupMetaStyles = StyleSheet.create({
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginVertical: 4,
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
		color: '#0f172a',
	},
	countText: {
		fontSize: 10,
		color: '#64748b',
	},
	noReviewsText: {
		fontSize: 10,
		color: '#94a3b8',
		fontStyle: 'italic',
	},
	difficultyBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	difficultyText: {
		fontSize: 9,
		fontWeight: '700',
	},
});

const styles = StyleSheet.create({
	popupContainer: {
		backgroundColor: '#fff',
		padding: 10,
		width: 220,
		position: 'relative',
		alignItems: 'flex-start',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 5,
	},
	lockedPopupContainer: {
		backgroundColor: '#fff',
		padding: 12,
		width: 220,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 5,
		borderRadius: 8,
	},
	lockedPopupTitle: {
		fontSize: 13,
		fontWeight: '700',
		color: '#0f172a',
		marginTop: 6,
		textAlign: 'center',
	},
	lockedPopupSubtext: {
		fontSize: 11,
		color: '#64748b',
		textAlign: 'center',
		marginVertical: 6,
	},
	popupTitle: {
		fontSize: 13,
		fontWeight: '700',
		color: '#333',
		textAlign: 'left',
	},
	popupDescription: {
		margin: 0,
		fontSize: 11,
		color: '#666',
	},
	popupArrow: {
		position: 'absolute',
		bottom: -6,
		left: '50%',
		width: 0,
		height: 0,
		borderLeftWidth: 6,
		borderRightWidth: 6,
		borderTopWidth: 6,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#ffffff',
	},
	popupImage: {
		width: '100%',
		height: 100,
		marginBottom: 6,
	},
	popupContent: {
		flexDirection: 'column',
		width: '100%',
	},
	clusterMarker: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#1e1e1e',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	clusterText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 16,
	},
	locationPin: {
		width: 32,
		height: 32,
		backgroundColor: '#0088cc',
		borderRadius: 18,
		borderBottomLeftRadius: 4,
		transform: [{rotate: '-45deg'}],
		alignItems: 'center',
		justifyContent: 'center',
	},
	locationPinCenter: {
		width: 12,
		height: 12,
		backgroundColor: '#fff',
		borderRadius: 6,
	},
});
