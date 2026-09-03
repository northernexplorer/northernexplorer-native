import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {EntranceCostEnum, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {CONDITION_ICON_MAP, COST_LABEL_MAP, DIFFICULTY_CONFIG, formatEnumLabel} from './reviewOptions';

type ReviewMetadataBadgesProps = {
	difficulty?: SiteDifficultyEnum;
	entranceCost?: EntranceCostEnum;
	conditions?: SiteConditionEnum[];
};

export function ReviewMetadataBadges({difficulty, entranceCost, conditions}: ReviewMetadataBadgesProps) {
	const diffConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;
	const costText = entranceCost ? COST_LABEL_MAP[entranceCost]?.badge : null;
	const hasConditions = conditions && conditions.length > 0;

	if (!diffConfig && !costText && !hasConditions) return null;

	return (
		<View style={styles.metaContainer}>
			{(diffConfig || costText) && (
				<View style={styles.badgeRow}>
					{diffConfig && (
						<View style={[styles.badge, {backgroundColor: diffConfig.bgColor}]}>
							<Text style={[styles.badgeText, {color: diffConfig.color}]}>{diffConfig.label}</Text>
						</View>
					)}

					{costText && (
						<View style={[styles.badge, styles.costBadge]}>
							<Ionicons name="cash-outline" size={12} color="#047857" />
							<Text style={[styles.badgeText, styles.costBadgeText]}>{costText}</Text>
						</View>
					)}
				</View>
			)}

			{hasConditions && (
				<View style={styles.conditionRow}>
					{conditions.map(cond => (
						<View key={cond} style={styles.conditionTag}>
							<Ionicons name={CONDITION_ICON_MAP[cond] ?? 'alert-circle-outline'} size={12} color="#ea580c" />
							<Text style={styles.conditionTagText}>{formatEnumLabel(cond)}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	metaContainer: {
		marginTop: 8,
		gap: 6,
	},
	badgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 6,
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	costBadge: {
		backgroundColor: '#d1fae5',
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '700',
	},
	costBadgeText: {
		color: '#047857',
	},
	conditionRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 4,
	},
	conditionTag: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: '#ffedd5',
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 12,
	},
	conditionTagText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#c2410c',
	},
});
