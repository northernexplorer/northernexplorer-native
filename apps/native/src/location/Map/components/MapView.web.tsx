import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import MapGL, {Layer, Marker, Source, useControl} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {useRouter} from 'expo-router';
import {getUrlSafeString} from '@northernexplorer/tools-web';
import {BBox} from 'geojson';
import {MapRef} from 'react-map-gl/mapbox-legacy';
import Supercluster from 'supercluster';
import {MapViewProps} from '../Map';
import {calculateDistance, formatDistance} from '../distance';
import {MapMarkerWeb} from '~/location/Map/components/MapMarkerWeb';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {setMeasuring} from '~/location/state/map/mapSlice';

class ThreeLabelScaleControl extends maplibregl.ScaleControl {
	private updateLabels = () => {
		const match = this._container.textContent.match(/^([\d.]+)\s*(.*)$/);
		if (!match) return;
		const labels = ['0', `${Number(match[1]) / 2} ${match[2]}`, `${match[1]} ${match[2]}`];
		this._container.replaceChildren(
			...labels.map((text, index) => {
				const label = document.createElement('span');
				label.textContent = text;
				Object.assign(label.style, {
					position: 'absolute',
					left: `${index * 50}%`,
					transform: `translateX(-${index * 50}%)`,
					whiteSpace: 'nowrap',
				});
				return label;
			}),
		);
	};

	onAdd(map: maplibregl.Map) {
		const container = super.onAdd(map);
		Object.assign(container.style, styles.scaleControl);
		this.updateLabels();
		map.on('move', this.updateLabels);
		return container;
	}

	onRemove() {
		this._map.off('move', this.updateLabels);
		super.onRemove();
	}
}

function NativeStyleScaleControl() {
	useControl(() => new ThreeLabelScaleControl(), {position: 'bottom-left'});
	return null;
}

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
	canAccessRemoteDifficulty,
	canUseDistanceScale,
	measuring,
	updateMapCenterAndBounds,
}: MapViewProps) {
	const mapRef = useRef<MapRef>(null);
	const router = useRouter();
	const dispatch = useDispatch();
	const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
	useEffect(() => {
		if (!measuring) setMeasurePoints([]);
	}, [measuring]);

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

	return (
		<div style={{width: '100%', height: '100%', minHeight: '400px', position: 'relative'}}>
			<MapGL
				ref={mapRef}
				mapLib={maplibregl}
				initialViewState={{
					longitude: initialLon,
					latitude: initialLat,
					zoom: initialZoom,
				}}
				mapStyle={baseLayer}
				onClick={(event: maplibregl.MapMouseEvent) => {
					if (measuring) {
						setMeasurePoints(points => [...points, [event.lngLat.lng, event.lngLat.lat]]);
						return;
					}
					setSelectedSite(null);
					setUserMarker(false);
				}}
				onLoad={updateMapState}
				onMoveEnd={updateMapState}
				interactiveLayerIds={['pointOfInterestsLayer']}
				cursor={measuring ? 'crosshair' : selectedSite ? 'pointer' : 'default'}
				minZoom={2}
			>
				{!measuring &&
					clusters.map(cluster => {
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
								canAccessRemoteDifficulty={canAccessRemoteDifficulty}
							/>
						);
					})}

				{!measuring && selectedSite && (
					<Marker longitude={selectedSite.lon} latitude={selectedSite.lat} anchor="bottom" offset={[0, -60]}>
						<PointOfInterestPreviewWidget
							id={selectedSite.id}
							name={selectedSite.name}
							description={selectedSite.description}
							image={selectedSite.image}
							country={selectedSite.country.name}
							region={selectedSite.region.name}
							latitude={selectedSite.lat}
							longitude={selectedSite.lon}
							rating={selectedSite.rating}
							difficulty={selectedSite.difficulty}
							reviews={selectedSite.reviews}
							onPress={event => {
								event.stopPropagation();
								router.push({
									pathname: '/[country]/[region]/[name]/[id]',
									params: {
										country: getUrlSafeString(selectedSite.country.name),
										region: getUrlSafeString(selectedSite.region.name),
										id: getUrlSafeString(selectedSite.id),
										name: getUrlSafeString(selectedSite.name),
									},
								});
							}}
						/>
					</Marker>
				)}

				{!measuring && coords && (
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

				{measuring && measurePoints.length >= 2 && (
					<Source
						id="measurement"
						type="geojson"
						data={{type: 'Feature', properties: {}, geometry: {type: 'LineString', coordinates: measurePoints}}}
					>
						<Layer id="measurement-line" type="line" paint={{'line-color': '#0088cc', 'line-width': 3}} />
					</Source>
				)}
				{measuring &&
					measurePoints.map(([longitude, latitude], index) => (
						<Marker key={index} longitude={longitude} latitude={latitude} anchor="center">
							<div
								style={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									background: '#0088cc',
									border: '2px solid white',
									pointerEvents: 'none',
								}}
							/>
						</Marker>
					))}
				{canUseDistanceScale && <NativeStyleScaleControl />}
			</MapGL>
			{measuring && (
				<div
					style={{
						position: 'absolute',
						top: 10,
						left: 10,
						zIndex: 1,
						background: '#1e1e1e',
						color: '#ffffff',
						fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
						fontSize: 14,
						padding: 12,
						borderRadius: 10,
						boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
					}}
				>
					<div>
						<div style={{fontWeight: 700}} aria-live="polite">
							Distance: {formatDistance(calculateDistance(measurePoints))}
						</div>
						<div style={{color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 4}}>Click the map to add points</div>
						<div style={{display: 'flex', gap: 8, marginTop: 8}}>
							<button type="button" style={styles.measurementButton} onClick={() => setMeasurePoints([])}>
								Clear
							</button>
							<button type="button" style={styles.measurementButton} onClick={() => dispatch(setMeasuring(false))}>
								Finish
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const styles = {
	scaleControl: {
		background: 'linear-gradient(to right, #000 50%, #fff 50%) bottom / 100% 5px no-repeat',
		border: 0,
		borderBottom: '1px solid #000',
		color: '#000',
		fontSize: 10,
		padding: '0 0 6px',
		height: '18px',
		position: 'relative',
		textAlign: 'center' as const,
		textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
	},
	measurementButton: {
		background: '#0088cc',
		border: 0,
		borderRadius: 8,
		color: '#ffffff',
		cursor: 'pointer',
		fontFamily: 'inherit',
		fontSize: 'inherit',
		fontWeight: 700,
		padding: '8px 12px',
	},
	popupContainer: {
		background: '#fff',
		padding: 10,
		boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
		width: 210,
		textAlign: 'left' as const,
		position: 'relative' as const,
		cursor: 'pointer',
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
