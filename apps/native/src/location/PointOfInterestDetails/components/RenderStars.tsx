import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ReviewRatingEnum} from '@northernexplorer/types';

export function RenderStars({rating}: {rating: ReviewRatingEnum}) {
	return (
		<View style={styles.starRow}>
			{[1, 2, 3, 4, 5].map(starIndex => {
				const isFilled = rating >= starIndex;
				return <Ionicons key={starIndex} name={isFilled ? 'star' : 'star-outline'} size={16} color={isFilled ? '#ffb400' : '#cbd5e1'} />;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	starRow: {
		flexDirection: 'row',
		gap: 2,
		marginTop: 2,
	},
});
