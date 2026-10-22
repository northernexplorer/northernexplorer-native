import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter, Link} from 'expo-router';
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';

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
			{/* Section Header */}
			<View style={styles.headerRow}>
				<Text style={styles.headerLabel}>Sort & Filter</Text>
			</View>

			{/* Sorting Options */}
			<View style={styles.optionsList}>
				{/* Nearby Option Card */}
				<TouchableOpacity
					style={[styles.optionCard, isNearby && styles.optionCardActive]}
					onPress={() => handleSortChange('nearby')}
					activeOpacity={0.7}
				>
					<View style={[styles.iconContainer, isNearby && styles.iconContainerActive]}>
						<MaterialCommunityIcons name="map-marker-radius-outline" size={20} color={isNearby ? '#38bdf8' : '#94a3b8'} />
					</View>
					<View style={styles.textContainer}>
						<Text style={[styles.optionTitle, isNearby && styles.optionTitleActive]}>Nearby Destinations</Text>
						<Text style={styles.optionDescription}>Ranked by distance from your coordinates</Text>
					</View>
					<View style={[styles.radioCircle, isNearby && styles.radioCircleActive]}>{isNearby && <View style={styles.radioInner} />}</View>
				</TouchableOpacity>

				{/* Newest Option Card */}
				<TouchableOpacity
					style={[styles.optionCard, !isNearby && styles.optionCardActive]}
					onPress={() => handleSortChange('newest')}
					activeOpacity={0.7}
				>
					<View style={[styles.iconContainer, !isNearby && styles.iconContainerActive]}>
						<MaterialCommunityIcons name="clock-outline" size={20} color={!isNearby ? '#38bdf8' : '#94a3b8'} />
					</View>
					<View style={styles.textContainer}>
						<Text style={[styles.optionTitle, !isNearby && styles.optionTitleActive]}>Newest Locations</Text>
						<Text style={styles.optionDescription}>Recently added sites</Text>
					</View>
					<View style={[styles.radioCircle, !isNearby && styles.radioCircleActive]}>{!isNearby && <View style={styles.radioInner} />}</View>
				</TouchableOpacity>
			</View>

			{/* Quick Map Action */}
			<View style={styles.actionSection}>
				<Link href="/map" asChild>
					<TouchableOpacity style={styles.mapButton} activeOpacity={0.8}>
						<Ionicons name="map-outline" size={15} color="#cbd5e1" />
						<Text style={styles.mapButtonText}>Open Interactive Map</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		gap: 12,
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
	optionsList: {
		flexDirection: 'column',
		gap: 8,
	},
	optionCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.08)',
		borderRadius: 12,
		padding: 12,
		gap: 12,
	},
	optionCardActive: {
		backgroundColor: 'rgba(2, 132, 199, 0.12)',
		borderColor: '#0284c7',
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconContainerActive: {
		backgroundColor: 'rgba(2, 132, 199, 0.25)',
	},
	textContainer: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#cbd5e1',
		marginBottom: 2,
	},
	optionTitleActive: {
		color: '#ffffff',
		fontWeight: '700',
	},
	optionDescription: {
		fontSize: 11,
		color: '#64748b',
		lineHeight: 14,
	},
	radioCircle: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 1.5,
		borderColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioCircleActive: {
		borderColor: '#38bdf8',
	},
	radioInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#38bdf8',
	},
	actionSection: {
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(255, 255, 255, 0.08)',
	},
	mapButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	mapButtonText: {
		color: '#cbd5e1',
		fontSize: 13,
		fontWeight: '600',
	},
});
