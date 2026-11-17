import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestTypeEnum, VisitedFilterEnum, EntranceCostEnum, RolesEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {SliderField, SwitchField} from '@northernexplorer/tools-web';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {
	setPoiTypes,
	setVisitedFilter,
	setMinRating,
	setMinDifficultyLevel,
	setMaxDifficultyLevel,
	setMinCostLevel,
	setMaxCostLevel,
	setShowDrafts,
} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {usePermissions} from '~/user/state/subscription';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {DIFFICULTY_CONFIG, COST_OPTIONS} from '~/location/PointOfInterestDetails/components/reviewOptions';
import {getMaxSiteDifficultyIndex} from '~/location/lib/siteDifficulty';

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

const COST_KEYS = COST_OPTIONS.map(c => c.value as EntranceCostEnum);

export function SearchSidebar() {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const permissions = usePermissions();
	const {
		selectedPoiTypes = [],
		visitedFilter = VisitedFilterEnum.All,
		minRating = null,
		minDifficultyIndex = 0,
		maxDifficultyIndex,
		minCostIndex = 0,
		maxCostIndex = COST_KEYS.length - 1,
		showDrafts = false,
	} = useMap();

	const isLoggedIn = !!authentication?.username;
	const canAccessRemoteDifficulty = !!permissions?.navigation.useRemoteDifficulty;
	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);

	const maxAllowedDifficultyIndex = getMaxSiteDifficultyIndex(canAccessRemoteDifficulty);

	const effectiveMaxDifficultyIndex = maxDifficultyIndex ?? maxAllowedDifficultyIndex;
	const effectiveMinDifficultyIndex = minDifficultyIndex;

	const handlePoiTypeChange = (_fieldName: string, newTypes: PointOfInterestTypeEnum[]) => {
		dispatch(setPoiTypes(newTypes));
	};

	return (
		<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.headerRow}>
				<Text style={styles.headerLabel}>Filters</Text>
			</View>

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
					label="Difficulty"
					minimumValue={0}
					maximumValue={Object.values(SiteDifficultyEnum).length - 1}
					step={1}
					values={[effectiveMinDifficultyIndex, effectiveMaxDifficultyIndex]}
					maxInteractiveValue={maxAllowedDifficultyIndex}
					warningLabel="Upgrade subscription to include harder difficulty tiers."
					onValuesChange={([minVal, maxVal]) => {
						dispatch(setMinDifficultyLevel(minVal));
						dispatch(setMaxDifficultyLevel(maxVal));
					}}
					getRangeDisplayLabel={([minVal, maxVal]) => {
						const minDiff = DIFFICULTY_CONFIG[Object.values(SiteDifficultyEnum)[minVal] as SiteDifficultyEnum];
						const maxDiff = DIFFICULTY_CONFIG[Object.values(SiteDifficultyEnum)[maxVal] as SiteDifficultyEnum];
						if (minVal === maxVal) {
							return minDiff.label;
						}
						const minIsDev = minVal < 4;
						const maxIsDev = maxVal < 4;
						if (minIsDev && maxIsDev) {
							return `Developed ${minDiff.levelLabel} – ${maxDiff.levelLabel}`;
						}
						if (!minIsDev && !maxIsDev) {
							return `Remote ${minDiff.levelLabel} – ${maxDiff.levelLabel}`;
						}
						return `${minDiff.label} – ${maxDiff.label}`;
					}}
				/>
			</View>

			{/* Cost Slider */}
			<View style={styles.section}>
				<SliderField
					label="Cost"
					minimumValue={0}
					maximumValue={COST_KEYS.length - 1}
					step={1}
					values={[minCostIndex, maxCostIndex]}
					onValuesChange={([minVal, maxVal]) => {
						dispatch(setMinCostLevel(minVal));
						dispatch(setMaxCostLevel(maxVal));
					}}
					getRangeDisplayLabel={([minVal, maxVal]) => {
						const minLabel = COST_OPTIONS.find(o => o.value === COST_KEYS[minVal])?.label ?? 'Free';
						const maxLabel = COST_OPTIONS.find(o => o.value === COST_KEYS[maxVal])?.label ?? 'Any';
						return minVal === maxVal ? minLabel : `${minLabel} – ${maxLabel}`;
					}}
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
						description="Include unpublished sites in search"
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
	headerRow: {
		marginBottom: 2,
	},
	headerLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#94a3b8',
		letterSpacing: 0.8,
		textTransform: 'uppercase',
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
		fontWeight: '600',
	},
	segmentTextActive: {
		color: 'white',
		fontWeight: '700',
	},
});
