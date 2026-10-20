import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export function DestinationSidebar() {
	const router = useRouter();
	const params = useLocalSearchParams<{sort?: 'nearby' | 'newest'}>();
	const currentSort = params.sort === 'newest' ? 'newest' : 'nearby';
	const isNearby = currentSort === 'nearby';

	const handleSortChange = (newSort: 'nearby' | 'newest') => {
		if (newSort !== currentSort) {
			router.setParams({
				sort: newSort,
				page: undefined,
			});
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={[styles.button, isNearby && styles.buttonActive]} onPress={() => handleSortChange('nearby')} activeOpacity={0.8}>
				<MaterialCommunityIcons name="map-marker-radius-outline" size={20} color={isNearby ? '#ffffff' : '#94a3b8'} />
				<Text style={[styles.buttonText, isNearby && styles.buttonTextActive]}>Nearby Destinations</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, !isNearby && styles.buttonActive]}
				onPress={() => handleSortChange('newest')}
				activeOpacity={0.8}
			>
				<MaterialCommunityIcons name="clock-outline" size={20} color={!isNearby ? '#ffffff' : '#94a3b8'} />
				<Text style={[styles.buttonText, !isNearby && styles.buttonTextActive]}>Newest Locations</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		gap: 8,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 14,
	},
	buttonActive: {
		backgroundColor: '#0284c7',
		borderColor: '#38bdf8',
	},
	buttonText: {
		color: '#94a3b8',
		fontSize: 14,
		fontWeight: '600',
	},
	buttonTextActive: {
		color: '#ffffff',
	},
});
