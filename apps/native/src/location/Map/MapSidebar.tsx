import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {PointOfInterestTypeEnum, VisitedFilterEnum, SiteDifficultyEnum, EntranceCostEnum, RolesEnum} from '@northernexplorer/types';
import {SliderField, SwitchField} from '@northernexplorer/tools-web';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {baseLayers} from '~/location/Map/baseLayers';
import {
	setBaseLayer,
	setPoiTypes,
	setVisitedFilter,
	setMinRating,
	setDifficultyLevel,
	setCostLevel,
	setShowDrafts,
} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {useApiFetch} from '~/core/useApiFetch';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {DIFFICULTY_CONFIG, COST_OPTIONS} from '~/location/PointOfInterestDetails/components/reviewOptions';

const LAYER_TILES = [
	{key: 'standard', label: 'Standard', layer: baseLayers.standard, icon: 'map-outline'},
	{key: 'satellite', label: 'Satellite', layer: baseLayers.satellite, icon: 'satellite-variant'},
	{key: 'terrain', label: 'Terrain', layer: baseLayers.terrain, icon: 'image-filter-hdr'},
] as const;

const VISITED_OPTIONS = [
	{key: VisitedFilterEnum.All, label: 'All', icon: 'map-marker-multiple-outline'},
	{key: VisitedFilterEnum.Visited, label: 'Visited', icon: 'map-marker-check-outline'},
	{key: VisitedFilterEnum.Unvisited, label: 'Unvisited', icon: 'map-marker-alert-outline'},
] as const;

const RATING_OPTIONS = [
	{label: 'Any', value: null},
	{label: '3+', value: 3},
	{label: '4+', value: 4},
	{label: '5', value: 5},
];

const DIFFICULTY_KEYS = Object.keys(DIFFICULTY_CONFIG) as SiteDifficultyEnum[];
const COST_KEYS = COST_OPTIONS.map(c => c.value as EntranceCostEnum);

export function MapSidebar() {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const {
		baseLayer,
		selectedPoiTypes = [],
		visitedFilter = VisitedFilterEnum.All,
		minRating = null,
		maxDifficultyIndex = DIFFICULTY_KEYS.length - 1,
		maxCostIndex = COST_KEYS.length - 1,
		showDrafts = false,
	} = useMap();

	const isLoggedIn = !!authentication?.username;
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});
	const canChangeMapStyle = !!permissionData?.navigation.changeMapStyle;
	const canAccessExpeditionDifficulty = !!permissionData?.navigation.useExpeditionDifficulty;
	const canAccessOffTrailDifficulty = !!permissionData?.navigation.useOffTrailDifficulty;
	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);

	// Determine the max allowed difficulty index based on permissions
	let maxAllowedDifficultyIndex = DIFFICULTY_KEYS.length - 1;
	if (!canAccessOffTrailDifficulty) {
		const offTrailIndex = DIFFICULTY_KEYS.findIndex(k => DIFFICULTY_CONFIG[k].label.toLowerCase().includes('off-trail'));
		if (offTrailIndex !== -1) {
			maxAllowedDifficultyIndex = offTrailIndex - 1;
		}
	}
	if (!canAccessExpeditionDifficulty) {
		const expeditionIndex = DIFFICULTY_KEYS.findIndex(k => DIFFICULTY_CONFIG[k].label.toLowerCase().includes('expedition'));
		if (expeditionIndex !== -1 && expeditionIndex - 1 < maxAllowedDifficultyIndex) {
			maxAllowedDifficultyIndex = expeditionIndex - 1;
		}
	}

	const bannerHref = isLoggedIn ? `/user/${authentication.username}/change-subscription` : '/user/login';
	const bannerTitle = 'Upgrade Required to Access All Map Styles';
	const bannerSubtitle = isLoggedIn ? 'Click to find out more' : 'Start by signing in';

	const handlePoiTypeChange = (_fieldName: string, newTypes: PointOfInterestTypeEnum[]) => {
		dispatch(setPoiTypes(newTypes));
	};

	return (
		<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<Text style={[styles.label, styles.labelDark]}>Map Style</Text>
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

			{isLoggedIn && (
				<View style={styles.section}>
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

			<View style={styles.section}>
				<Text style={[styles.label, styles.labelDark]}>Minimum Rating</Text>
				<View style={styles.segmentedControl}>
					{RATING_OPTIONS.map(option => {
						const isActive = minRating === option.value;
						return (
							<TouchableOpacity
								key={String(option.value)}
								activeOpacity={0.8}
								onPress={() => dispatch(setMinRating(option.value))}
								style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
							>
								<Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{option.label}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{/* Difficulty Slider */}
			<View style={styles.section}>
				<SliderField
					label="Max Difficulty"
					minimumValue={0}
					maximumValue={DIFFICULTY_KEYS.length - 1}
					step={1}
					value={maxDifficultyIndex}
					maxInteractiveValue={maxAllowedDifficultyIndex}
					warningLabel="Upgrade subscription to include harder difficulty tiers."
					onValueChange={val => {
						dispatch(setDifficultyLevel(val));
					}}
					getDisplayLabel={val => DIFFICULTY_CONFIG[DIFFICULTY_KEYS[val]].label.split(' ')[0]}
				/>
			</View>

			{/* Cost Slider */}
			<View style={styles.section}>
				<SliderField
					label="Max Cost"
					minimumValue={0}
					maximumValue={COST_KEYS.length - 1}
					step={1}
					value={maxCostIndex}
					onValueChange={val => {
						dispatch(setCostLevel(val));
					}}
					getDisplayLabel={val => COST_OPTIONS.find(o => o.value === COST_KEYS[val])?.label ?? 'Any'}
				/>
			</View>

			<PointOfInterestTypeDropdown fieldName="poiTypes" label="Types" value={selectedPoiTypes} updateField={handlePoiTypeChange} darkMode />

			{/* Admin Controls Section */}
			{isAdmin && (
				<View style={styles.adminSection}>
					<View style={styles.adminHeader}>
						<MaterialCommunityIcons name="shield-outline" size={16} color="#f59e0b" />
						<Text style={styles.adminTitle}>Admin Options</Text>
					</View>
					<SwitchField
						fieldName="showDrafts"
						label="Show Draft Sites"
						description="Include unpublished sites on the map"
						value={showDrafts}
						updateField={(_name, val) => dispatch(setShowDrafts(val))}
					/>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingBottom: 24,
	},
	section: {
		marginTop: 4,
	},
	adminSection: {
		marginTop: 8,
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(245, 158, 11, 0.06)',
		borderWidth: 1,
		borderColor: 'rgba(245, 158, 11, 0.2)',
		gap: 8,
	},
	adminHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginBottom: 2,
	},
	adminTitle: {
		fontSize: 12,
		fontWeight: '700',
		color: '#f59e0b',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	segmentedControl: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 10,
		padding: 3,
		borderWidth: 1,
		marginTop: 5,
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
