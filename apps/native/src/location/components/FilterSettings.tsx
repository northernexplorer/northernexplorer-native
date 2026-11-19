import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestTypeEnum, VisitedFilterEnum, EntranceCostEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {SliderField} from '@northernexplorer/tools-web';
import {PointOfInterestTypeDropdown} from '~/layout/Layout/components/PointOfInterestTypeDropdown';
import {
	setPoiTypes,
	setVisitedFilter,
	setMinRating,
	setMinDifficultyLevel,
	setMaxDifficultyLevel,
	setMinCostLevel,
	setMaxCostLevel,
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

export function FilterSettings({map = false}: {map?: boolean}) {
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
	} = useMap();
	const maxAllowedDifficultyIndex = getMaxSiteDifficultyIndex(!!permissions?.navigation.useRemoteDifficulty);
	const effectiveMaxDifficultyIndex = maxDifficultyIndex ?? maxAllowedDifficultyIndex;

	const handlePoiTypeChange = (_fieldName: string, newTypes: PointOfInterestTypeEnum[]) => {
		dispatch(setPoiTypes(newTypes));
	};

	return (
		<>
			{!!authentication?.username && (
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
									<Text
										style={[
											styles.segmentText,
											map && styles.mapSegmentText,
											isActive && styles.segmentTextActive,
											map && isActive && styles.mapSegmentTextActive,
										]}
									>
										{option.label}
									</Text>
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
								<Text
									style={[
										styles.segmentText,
										map && styles.mapSegmentText,
										isActive && styles.segmentTextActive,
										map && isActive && styles.mapSegmentTextActive,
									]}
								>
									{option.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
			<View style={styles.section}>
				<SliderField
					label="Difficulty"
					minimumValue={0}
					maximumValue={Object.values(SiteDifficultyEnum).length - 1}
					step={1}
					values={[minDifficultyIndex, effectiveMaxDifficultyIndex]}
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
		</>
	);
}

const styles = StyleSheet.create({
	section: {marginTop: 4},
	segmentedControl: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 10,
		padding: 3,
		borderWidth: 1,
		marginTop: 5,
		borderColor: 'rgba(255,255,255,0.1)',
	},
	label: {fontSize: 15, fontWeight: '600', color: '#333'},
	labelDark: {color: '#EEE'},
	segmentButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8},
	segmentButtonActive: {backgroundColor: '#0088cc'},
	segmentText: {color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600'},
	mapSegmentText: {fontWeight: '500'},
	segmentTextActive: {color: 'white', fontWeight: '700'},
	mapSegmentTextActive: {fontWeight: '600'},
});
