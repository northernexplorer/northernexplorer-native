import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {Spinner} from '~/layout/Layout/elements/Spinner';
import {getMoonIcon} from '~/environment/lib/getMoonIcon';

export function Lunar() {
	const lunar = useLunar();

	if (!lunar) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	const icon = getMoonIcon(lunar);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<View style={styles.centerContainer}>
					{/* Expanded Moon Icon */}
					<View style={styles.iconWrapper}>
						<MaterialCommunityIcons name={icon} size={160} color="#0f172a" />
					</View>

					{/* Primary Phase Title */}
					<Text style={styles.phaseName}>{lunar.phase_name}</Text>

					{/* Main Illumination Readout */}
					<Text style={styles.illuminationText}>
						{Math.round(lunar.illumination_percentage)}% <Text style={styles.illuminationLabel}>Illuminated</Text>
					</Text>

					{/* Additional Metrics Grid */}
					<View style={styles.metricsContainer}>
						{/* Moon Age */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="calendar-clock" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Moon Age</Text>
								<Text style={styles.metricValue}>{lunar.moon_age_days.toFixed(1)} days</Text>
							</View>
						</View>

						{/* Waxing / Waning Status */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name={lunar.is_waxing ? 'chart-line-variant' : 'chart-line-stacked'} size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Cycle Trend</Text>
								<Text style={styles.metricValue}>{lunar.is_waxing ? 'Waxing' : 'Waning'}</Text>
							</View>
						</View>

						{/* Phase Fraction */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="gauge" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Phase Progress</Text>
								<Text style={styles.metricValue}>{Math.round(lunar.phase_fraction * 100)}%</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	iconWrapper: {
		width: 180,
		height: 180,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	phaseName: {
		color: '#0f172a',
		fontSize: 30,
		fontWeight: '800',
		textAlign: 'center',
		letterSpacing: -0.5,
	},
	illuminationText: {
		color: '#0284c7',
		fontSize: 22,
		fontWeight: '700',
		marginTop: 6,
		marginBottom: 32,
		textAlign: 'center',
	},
	illuminationLabel: {
		color: '#64748b',
		fontSize: 16,
		fontWeight: '500',
	},
	metricsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
		width: '100%',
		maxWidth: 420,
	},
	metricCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		width: '48%',
		minWidth: 150,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0, 0, 0, 0.05)',
	},
	metricInfo: {
		flexDirection: 'column',
		flexShrink: 1,
	},
	metricLabel: {
		color: '#64748b',
		fontSize: 11,
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	metricValue: {
		color: '#0f172a',
		fontSize: 14,
		fontWeight: '700',
		marginTop: 2,
	},
});
