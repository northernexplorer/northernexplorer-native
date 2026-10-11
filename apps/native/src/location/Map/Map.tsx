import React, {useState, useMemo, useRef, useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {BBox, Point, Feature} from 'geojson';
import Supercluster, {AnyProps} from 'supercluster';
import useSupercluster from 'use-supercluster';
import {Spinner} from '@northernexplorer/tools-web';
import {PointOfInterestType, SiteDifficultyEnum} from '@northernexplorer/types';
import {MapView} from './components/MapView';
import {useApiFetch} from '~/core/useApiFetch';
import {useLocation} from '~/location/state/location/useLocation';
import {useMap} from '~/location/state/map/useMap';
import {MapStyleObject} from '~/location/state/map/mapSlice';

export interface PointOfInterestProperties {
	cluster?: boolean;
	siteId?: string;
	site?: PointOfInterestType;
}

export type PointOfInterestFeature = Feature<Point, PointOfInterestProperties>;

export type SuperclusterItem = PointOfInterestFeature | Supercluster.ClusterFeature<AnyProps>;

export interface MapViewProps {
	baseLayer: MapStyleObject;
	clusters: SuperclusterItem[];
	supercluster: Supercluster<PointOfInterestProperties, Point> | null | undefined;
	selectedSite: PointOfInterestType | null;
	setSelectedSite: React.Dispatch<React.SetStateAction<PointOfInterestType | null>>;
	userMarker: boolean;
	setUserMarker: React.Dispatch<React.SetStateAction<boolean>>;
	coords: {lat: number; lon: number} | null;
	initialLat: number;
	initialLon: number;
	initialZoom: number;
	canAccessOffTrailDifficulty: boolean;
	canAccessExpeditionDifficulty: boolean;
	isSelectedLocked: boolean;
	updateMapCenterAndBounds: (bounds: BBox, zoom: number, center: {lat: number; lon: number}) => void;
}

function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Earth radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export function Map() {
	const {baseLayer, selectedPoiTypes, visitedFilter, minRating, maxDifficultyIndex, maxCostIndex, showDrafts} = useMap();
	const coords = useLocation();
	const params = useLocalSearchParams<{lat?: string; lon?: string; zoom?: string; selectedId?: string}>();

	// Permissions
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});
	const canAccessOffTrailDifficulty = permissionData?.navigation.useOffTrailDifficulty ?? false;
	const canAccessExpeditionDifficulty = permissionData?.navigation.useExpeditionDifficulty ?? false;

	// Center resolution logic
	const paramLat = params.lat ? parseFloat(params.lat) : undefined;
	const paramLon = params.lon ? parseFloat(params.lon) : undefined;
	const initialZoom = params.zoom ? parseFloat(params.zoom) : 10;

	const [initialCoords, setInitialCoords] = useState<{lat: number; lon: number} | null>(() => {
		if (paramLat !== undefined && paramLon !== undefined && !isNaN(paramLat) && !isNaN(paramLon)) {
			return {lat: paramLat, lon: paramLon};
		}
		if (coords) {
			return {lat: coords.lat, lon: coords.lon};
		}
		return null;
	});

	useEffect(() => {
		if (paramLat !== undefined && paramLon !== undefined && !isNaN(paramLat) && !isNaN(paramLon)) {
			setInitialCoords({lat: paramLat, lon: paramLon});
		} else {
			setInitialCoords(prev => {
				if (prev) return prev;
				if (coords) {
					return {lat: coords.lat, lon: coords.lon};
				}
				return null;
			});
		}
	}, [paramLat, paramLon, coords]);

	const initialLat = initialCoords?.lat;
	const initialLon = initialCoords?.lon;

	const [bounds, setBounds] = useState<BBox | undefined>(undefined);
	const [zoom, setZoom] = useState<number>(initialZoom);
	const [selectedSite, setSelectedSite] = useState<PointOfInterestType | null>(null);
	const [userMarker, setUserMarker] = useState<boolean>(false);

	const [mapCenter, setMapCenter] = useState<{lat: number; lon: number}>({
		lat: initialLat || 0,
		lon: initialLon || 0,
	});

	const lastFetchedCenterRef = useRef<{lat: number; lon: number; zoom: number}>({
		lat: initialLat || 0,
		lon: initialLon || 0,
		zoom: initialZoom,
	});
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Keep map center aligned when location updates initially
	const isInitializedRef = useRef<boolean>(false);
	useEffect(() => {
		if (!isInitializedRef.current && initialLat && initialLon) {
			setMapCenter({lat: initialLat, lon: initialLon});
			lastFetchedCenterRef.current = {lat: initialLat, lon: initialLon, zoom: initialZoom};
			isInitializedRef.current = true;
		}
	}, [initialLat, initialLon, initialZoom]);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	// Data fetching
	const {data} = useApiFetch('location', 'PointOfInterestController', 'getForMap', {
		lat: mapCenter.lat,
		lon: mapCenter.lon,
		limit: 500,
		selectedPoiTypes,
		visitedFilter,
		minRating,
		maxDifficultyIndex,
		maxCostIndex,
		showDrafts,
	});

	const points = useMemo<PointOfInterestFeature[]>(() => {
		if (!data) return [];
		return data.map((site: PointOfInterestType) => ({
			type: 'Feature',
			properties: {cluster: false, siteId: site.id, site},
			geometry: {type: 'Point', coordinates: [site.lon, site.lat]},
		}));
	}, [data]);

	const {clusters, supercluster} = useSupercluster<PointOfInterestProperties, Point>({
		points,
		bounds,
		zoom,
		options: {radius: 75, maxZoom: 20},
	});

	const updateMapCenterAndBounds = (nextBounds: BBox, nextZoom: number, nextCenter: {lat: number; lon: number}) => {
		setBounds(nextBounds);
		setZoom(nextZoom);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			const lastFetched = lastFetchedCenterRef.current;
			const distance = calculateDistanceInKm(lastFetched.lat, lastFetched.lon, nextCenter.lat, nextCenter.lon);
			const thresholdKm = Math.max(0.5, 10000 / Math.pow(2, nextZoom));
			const zoomDelta = Math.abs(nextZoom - lastFetched.zoom);

			if (distance >= thresholdKm || zoomDelta >= 1.5) {
				lastFetchedCenterRef.current = {lat: nextCenter.lat, lon: nextCenter.lon, zoom: nextZoom};
				setMapCenter(nextCenter);
			}
		}, 400);
	};

	// Lock condition evaluation
	const selectedIsOffTrail = selectedSite?.difficulty === SiteDifficultyEnum.OFF_TRAIL_REMOTE;
	const selectedIsExpedition = selectedSite?.difficulty === SiteDifficultyEnum.EXPEDITION_ONLY;
	const isSelectedLocked = (selectedIsOffTrail && !canAccessOffTrailDifficulty) || (selectedIsExpedition && !canAccessExpeditionDifficulty);

	if (!initialLat || !initialLon) {
		return <Spinner />;
	}

	return (
		<MapView
			baseLayer={baseLayer}
			clusters={clusters as SuperclusterItem[]}
			supercluster={supercluster}
			selectedSite={selectedSite}
			setSelectedSite={setSelectedSite}
			userMarker={userMarker}
			setUserMarker={setUserMarker}
			coords={coords ? {lat: coords.lat, lon: coords.lon} : null}
			initialLat={initialLat}
			initialLon={initialLon}
			initialZoom={initialZoom}
			canAccessOffTrailDifficulty={canAccessOffTrailDifficulty}
			canAccessExpeditionDifficulty={canAccessExpeditionDifficulty}
			isSelectedLocked={isSelectedLocked}
			updateMapCenterAndBounds={updateMapCenterAndBounds}
		/>
	);
}
