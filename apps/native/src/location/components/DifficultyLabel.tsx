import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SiteDifficultyEnum} from '@northernexplorer/types';
import {DIFFICULTY_CONFIG} from '~/location/PointOfInterestDetails/components/reviewOptions';

type Props = {
	difficulty: SiteDifficultyEnum;
	color?: string;
	iconSize?: number;
	textStyle?: StyleProp<TextStyle>;
};

export function DifficultyLabel({difficulty, color, iconSize = 12, textStyle}: Props) {
	const difficultyInfo = DIFFICULTY_CONFIG[difficulty];
	const labelColor = color ?? difficultyInfo.color;

	return (
		<View style={styles.container} accessible accessibilityRole="text" accessibilityLabel={difficultyInfo.label}>
			<Ionicons name={difficultyInfo.categoryIcon} size={iconSize} color={labelColor} />
			<Text style={[styles.text, {color: labelColor}, textStyle]}>{difficultyInfo.levelLabel}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
	},
	text: {
		fontSize: 12,
		fontWeight: '600',
	},
});
