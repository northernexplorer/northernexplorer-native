import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {useWeather} from '~/environment/state/weather';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function Weather() {
	const weather = useWeather();

	if (!weather) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	const current = weather.current;
	const condition = current.condition;
	const iconName = getWeatherIcon(String(condition.code));

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Location Header */}
				<Text style={styles.locationName}>{weather.location.name}</Text>

				{/* Hero Weather Condition & Temperature */}
				<View style={styles.heroSection}>
					<MaterialCommunityIcons name={iconName} size={110} color="#0f172a" />
					<Text style={styles.temperature}>{Math.round(current.temp_c)}°</Text>
				</View>

				{/* Condition Text */}
				<Text style={styles.conditionText}>{condition.text}</Text>

				{/* Key Metrics Row */}
				<View style={styles.metricsContainer}>
					<View style={styles.metricCard}>
						<MaterialCommunityIcons name="weather-windy" size={20} color="#0284c7" />
						<View style={styles.metricInfo}>
							<Text style={styles.metricLabel}>Wind</Text>
							<Text style={styles.metricValue}>{Math.round(current.wind_kph)} km/h</Text>
						</View>
					</View>

					<View style={styles.metricCard}>
						<MaterialCommunityIcons name="water-outline" size={20} color="#0284c7" />
						<View style={styles.metricInfo}>
							<Text style={styles.metricLabel}>Humidity</Text>
							<Text style={styles.metricValue}>{current.humidity}%</Text>
						</View>
					</View>
					<View style={styles.metricCard}>
						<MaterialCommunityIcons name="thermometer" size={20} color="#0284c7" />
						<View style={styles.metricInfo}>
							<Text style={styles.metricLabel}>Feels Like</Text>
							<Text style={styles.metricValue}>{Math.round(current.feelslike_c)}°</Text>
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
	},
	scrollContent: {
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	locationName: {
		color: '#475569',
		fontSize: 14,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 1.2,
		marginBottom: 16,
	},
	heroSection: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
		marginVertical: 12,
	},
	temperature: {
		color: '#0f172a',
		fontSize: 88,
		fontWeight: '200',
		letterSpacing: -2,
	},
	conditionText: {
		color: '#1e293b',
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 32,
		textAlign: 'center',
	},
	metricsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
		width: '100%',
		maxWidth: 400,
	},
	metricCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		minWidth: 140,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0, 0, 0, 0.05)',
	},
	metricInfo: {
		flexDirection: 'column',
	},
	metricLabel: {
		color: '#64748b',
		fontSize: 11,
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	metricValue: {
		color: '#0f172a',
		fontSize: 15,
		fontWeight: '700',
		marginTop: 2,
	},
});
