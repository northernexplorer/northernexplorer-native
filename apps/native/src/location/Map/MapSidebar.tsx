import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {PointOfInterestTypeEnum, VisitedFilterEnum} from '@northernexplorer/types';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {baseLayers} from '~/location/Map/baseLayers';
import {setBaseLayer, setPoiTypes, setVisitedFilter} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

const LAYER_TILES = [
	{
		key: 'standard',
		label: 'Standard',
		layer: baseLayers.standard,
		icon: 'map-outline',
	},
	{
		key: 'satellite',
		label: 'Satellite',
		layer: baseLayers.satellite,
		icon: 'satellite-variant',
	},
	{
		key: 'terrain',
		label: 'Terrain',
		layer: baseLayers.terrain,
		icon: 'image-filter-hdr',
	},
] as const;

const VISITED_OPTIONS: {key: VisitedFilterEnum; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap}[] = [
	{key: VisitedFilterEnum.All, label: 'All', icon: 'map-marker-multiple-outline'},
	{key: VisitedFilterEnum.Visited, label: 'Visited', icon: 'map-marker-check-outline'},
	{key: VisitedFilterEnum.Unvisited, label: 'Unvisited', icon: 'map-marker-alert-outline'},
];

export function MapSidebar() {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const {baseLayer, selectedPoiTypes = [], visitedFilter = VisitedFilterEnum.All} = useMap();

	const isLoggedIn = !!authentication?.username;

	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	const canChangeMapStyle = !!permissionData?.navigation.changeMapStyle;

	const bannerHref = isLoggedIn ? `/profile/${authentication.username}/change-subscription` : '/profile/login';
	const bannerTitle = 'Upgrade Required to Access All Map Styles';
	const bannerSubtitle = isLoggedIn ? 'Click to find out more' : 'Start by signing in';

	const handlePoiTypeChange = (_fieldName: string, newTypes: PointOfInterestTypeEnum[]) => {
		dispatch(setPoiTypes(newTypes));
	};

	if (!permissionData) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Map Style</Text>
			<View style={[styles.tileGroup, !canChangeMapStyle && styles.disabledGroup]}>
				{LAYER_TILES.map(item => {
					const isActive = JSON.stringify(baseLayer) === JSON.stringify(item.layer);

					return (
						<TouchableOpacity
							key={item.key}
							activeOpacity={0.8}
							disabled={!canChangeMapStyle}
							onPress={() => dispatch(setBaseLayer(item.layer))}
							style={[styles.tileCard, isActive && styles.tileCardActive]}
						>
							<View style={styles.tilePreview}>
								<MaterialCommunityIcons name={item.icon} size={28} color={isActive ? 'white' : 'rgba(255,255,255,0.72)'} />
							</View>
							<Text style={[styles.menuText, isActive && styles.activeText]}>{item.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<Text style={styles.heading}>Filter</Text>

			{/* Visited / Unvisited Toggle Filter */}
			{isLoggedIn && (
				<View style={styles.visitedFilterSection}>
					<Text style={[styles.label, styles.labelDark]}>Visits</Text>
					<View style={styles.segmentedControl}>
						{VISITED_OPTIONS.map(option => {
							const isActive = visitedFilter === option.key;
							return (
								<TouchableOpacity
									key={option.key}
									activeOpacity={0.8}
									onPress={() => dispatch(setVisitedFilter(option.key))}
									style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
								>
									<MaterialCommunityIcons name={option.icon} size={16} color={isActive ? 'white' : 'rgba(255,255,255,0.6)'} />
									<Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{option.label}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			)}
			<PointOfInterestTypeDropdown fieldName="poiTypes" label="Types" value={selectedPoiTypes} updateField={handlePoiTypeChange} darkMode />

			{!canChangeMapStyle && (
				<Link href={bannerHref} asChild>
					<TouchableOpacity activeOpacity={0.8}>
						<View style={styles.banner}>
							<Text style={styles.bannerTitle}>{bannerTitle}</Text>
							<Text style={styles.bannerSubtitle}>{bannerSubtitle}</Text>
						</View>
					</TouchableOpacity>
				</Link>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	heading: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginTop: 8,
		marginBottom: 4,
	},
	subHeading: {
		color: 'rgba(255,255,255,0.8)',
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 6,
	},
	visitedFilterSection: {
		marginTop: 4,
	},
	segmentedControl: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 10,
		padding: 3,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.1)',
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#333',
	},
	labelDark: {
		color: '#EEE',
	},
	segmentButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		paddingVertical: 8,
		borderRadius: 8,
	},
	segmentButtonActive: {
		backgroundColor: '#0088cc',
	},
	segmentText: {
		color: 'rgba(255,255,255,0.6)',
		fontSize: 12,
		fontWeight: '500',
	},
	segmentTextActive: {
		color: 'white',
		fontWeight: '600',
	},
	tileGroup: {
		flexDirection: 'row',
		gap: 8,
	},
	disabledGroup: {
		opacity: 0.4,
		pointerEvents: 'none',
	},
	tileCard: {
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
		backgroundColor: 'rgba(255,255,255,0.04)',
		padding: 4,
	},
	tileCardActive: {
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderColor: 'rgba(255,255,255,0.2)',
	},
	tilePreview: {
		width: 65,
		height: 65,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.04)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuText: {
		color: 'rgba(255,255,255,0.72)',
		fontSize: 11,
		marginTop: 4,
		marginBottom: 2,
	},
	activeText: {
		color: 'white',
		fontWeight: '600',
	},
	banner: {
		backgroundColor: 'rgba(255,255,255,0.04)',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#333333',
		padding: 12,
		marginTop: 4,
	},
	bannerTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: 'white',
		marginBottom: 2,
	},
	bannerSubtitle: {
		fontSize: 13,
		lineHeight: 18,
		color: 'rgba(255,255,255,0.78)',
	},
});
