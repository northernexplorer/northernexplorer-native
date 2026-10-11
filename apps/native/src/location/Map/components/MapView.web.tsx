import React, {useRef, useCallback} from 'react';
import MapGL, {Marker} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Link} from 'expo-router';
import {getImageUrl, getUrlSafeString} from '@northernexplorer/tools-web';
import {BBox} from 'geojson';
import {MapRef} from 'react-map-gl/mapbox-legacy';
import Supercluster from 'supercluster';
import {MapViewProps} from '../Map';
import {config} from '~/config';
import {MapMarkerWeb} from '~/location/Map/components/MapMarkerWeb';
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
	const mapRef = useRef<MapRef>(null);

	const updateMapState = useCallback(() => {
		if (mapRef.current) {
			const b = mapRef.current.getBounds();
			const center = mapRef.current.getCenter();

			const nextBounds: BBox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
			updateMapCenterAndBounds(nextBounds, mapRef.current.getZoom(), {
				lat: center.lat,
				lon: center.lng,
			});
		}
	}, [updateMapCenterAndBounds]);

	const rawRating = selectedSite?.rating
		? typeof selectedSite.rating === 'number'
			? selectedSite.rating
			: parseFloat(String(selectedSite.rating))
		: 0;
	const averageRating = !isNaN(rawRating) && rawRating > 0 ? rawRating : 0;
	const reviewCount = selectedSite?.reviews?.length ?? 0;
	const difficultyInfo = selectedSite?.difficulty ? DIFFICULTY_CONFIG[selectedSite.difficulty] : null;

	return (
		<div style={{width: '100%', height: '100%', minHeight: '400px'}}>
			<MapGL
				ref={mapRef}
				mapLib={maplibregl}
				initialViewState={{
					longitude: initialLon,
					latitude: initialLat,
					zoom: initialZoom,
				}}
				mapStyle={baseLayer}
				onClick={() => {
					setSelectedSite(null);
					setUserMarker(false);
				}}
				onLoad={updateMapState}
				onMoveEnd={updateMapState}
				interactiveLayerIds={['pointOfInterestsLayer']}
				cursor={selectedSite ? 'pointer' : 'default'}
				minZoom={2}
			>
				{clusters.map(cluster => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const isCluster = 'cluster' in cluster.properties && cluster.properties.cluster;

					if (isCluster) {
						const clusterFeature = cluster as Supercluster.ClusterFeature<Supercluster.AnyProps>;
						const clusterId = clusterFeature.id as number | undefined;
						const pointCount = clusterFeature.properties.point_count;

						return (
							<Marker key={`cluster-${clusterFeature.id}`} longitude={longitude} latitude={latitude} anchor="center">
								<div
									style={styles.clusterMarker}
									onClick={e => {
										e.stopPropagation();
										if (!supercluster || clusterId === undefined) return;
										const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 20);
										mapRef.current?.flyTo({
											center: [longitude, latitude],
											zoom: expansionZoom,
											speed: 1.2,
										});
									}}
								>
									{pointCount}
								</div>
							</Marker>
						);
					}

					const site = cluster.properties.site;
					if (!site) return null;

					return (
						<MapMarkerWeb
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
					<Marker longitude={selectedSite.lon} latitude={selectedSite.lat} anchor="bottom" offset={[0, -60]}>
						{isSelectedLocked ? (
							<div style={styles.lockedPopupContainer}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="#e67e22" style={{marginBottom: 4}}>
									<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
								</svg>
								<h3 style={styles.lockedPopupTitle}>Restricted Access</h3>
								<p style={styles.lockedPopupSubtext}>Sign in or upgrade your account to view details for this location.</p>
								<div style={styles.popupArrow} />
							</div>
						) : (
							<div style={styles.popupContainer}>
								<Link
									href={{
										pathname: '/[country]/[region]/[name]/[id]',
										params: {
											country: getUrlSafeString(selectedSite.country.name),
											region: getUrlSafeString(selectedSite.region.name),
											id: getUrlSafeString(selectedSite.id),
											name: getUrlSafeString(selectedSite.name),
										},
									}}
								>
									<img
										alt={selectedSite.name}
										src={getImageUrl({
											path: selectedSite.image.url,
											cdn: config.CONTENT_DELIVERY_NETWORK,
											processed: selectedSite.image.processed,
											size: 'thumbnail',
										})}
										style={{
											width: '100%',
											height: 110,
											objectFit: 'cover',
											marginBottom: 6,
										}}
									/>

									<h3 style={styles.popupTitle}>{selectedSite.name}</h3>

									<div style={styles.metaRow}>
										{averageRating > 0 ? (
											<div style={styles.ratingRow}>
												<span style={{color: '#f59e0b', fontSize: 12}}>★</span>
												<span style={styles.ratingText}>{averageRating.toFixed(1)}</span>
												<span style={styles.countText}>({reviewCount})</span>
											</div>
										) : (
											<span style={styles.noReviewsText}>No reviews</span>
										)}

										{difficultyInfo && (
											<span
												style={{
													...styles.difficultyBadge,
													backgroundColor: difficultyInfo.bgColor,
													color: difficultyInfo.color,
												}}
											>
												{difficultyInfo.label.split(' ')[0]}
											</span>
										)}
									</div>

									<p
										style={{
											...styles.popupDescription,
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
										}}
									>
										{selectedSite.description}
									</p>
								</Link>

								<div style={styles.popupArrow} />
							</div>
						)}
					</Marker>
				)}

				{coords && (
					<>
						<Marker
							onClick={e => {
								e.originalEvent.stopPropagation();
								setUserMarker(prev => !prev);
								setSelectedSite(null);
							}}
							latitude={coords.lat}
							longitude={coords.lon}
							anchor="center"
						>
							<div style={styles.userLocationMarker} title="Your Location">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-4-4z" />
								</svg>
							</div>
						</Marker>

						{userMarker && (
							<Marker latitude={coords.lat} longitude={coords.lon} anchor="bottom" offset={[0, -25]}>
								<div style={styles.popupContainer}>
									<h3 style={styles.popupTitle}>Your Location</h3>
									<p style={styles.popupDescription}>{coords.lat}</p>
									<p style={styles.popupDescription}>{coords.lon}</p>
									<div style={styles.popupArrow} />
								</div>
							</Marker>
						)}
					</>
				)}
			</MapGL>
		</div>
	);
}

const styles = {
	popupContainer: {
		background: '#fff',
		padding: 10,
		boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
		width: 210,
		textAlign: 'left' as const,
		position: 'relative' as const,
		cursor: 'pointer',
	},
	lockedPopupContainer: {
		background: '#fff',
		padding: 12,
		boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
		width: 210,
		borderRadius: 8,
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center' as const,
		position: 'relative' as const,
	},
	lockedPopupTitle: {
		margin: '0 0 4px',
		fontSize: 13,
		fontWeight: 700,
		color: '#0f172a',
	},
	lockedPopupSubtext: {
		margin: '0 0 8px',
		fontSize: 11,
		color: '#64748b',
		lineHeight: 1.3,
	},
	popupTitle: {
		margin: '0 0 4px',
		fontSize: 13,
		fontWeight: 700,
		color: '#333',
	},
	popupDescription: {
		margin: 0,
		fontSize: 11,
		color: '#666',
	},
	metaRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 6,
		gap: 4,
	},
	ratingRow: {
		display: 'flex',
		alignItems: 'center',
		gap: 3,
	},
	ratingText: {
		fontSize: 11,
		fontWeight: 700,
		color: '#0f172a',
	},
	countText: {
		fontSize: 10,
		color: '#64748b',
	},
	noReviewsText: {
		fontSize: 10,
		color: '#94a3b8',
		fontStyle: 'italic' as const,
	},
	difficultyBadge: {
		padding: '2px 6px',
		borderRadius: 4,
		fontSize: 9,
		fontWeight: 700,
	},
	popupArrow: {
		position: 'absolute' as const,
		bottom: -6,
		left: '50%',
		transform: 'translateX(-50%)',
		width: 0,
		height: 0,
		borderLeft: '6px solid transparent',
		borderRight: '6px solid transparent',
		borderTop: '6px solid white',
	},
	clusterMarker: {
		width: 44,
		height: 44,
		borderRadius: '50%',
		backgroundColor: '#1e1e1e',
		color: '#fff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
		cursor: 'pointer',
	},
	userLocationMarker: {
		width: '34px',
		height: '34px',
		borderRadius: '50%',
		backgroundColor: '#0088cc',
		border: '2.5px solid #ffffff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
		cursor: 'pointer',
	},
};
