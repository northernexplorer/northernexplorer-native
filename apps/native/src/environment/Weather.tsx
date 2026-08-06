import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Spinner} from '@northernexplorer/tools';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {useWeather} from '~/environment/state/weather';

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
				<View style={styles.centerContainer}>
					{/* Location Header */}
					<Text style={styles.locationName}>{weather.location.name}</Text>

					{/* Hero Weather Condition & Temperature */}
					<View style={styles.heroSection}>
						<MaterialCommunityIcons name={iconName} size={110} color="#0f172a" />
						<Text style={styles.temperature}>{Math.round(current.temp_c)}°</Text>
					</View>

					{/* Condition Text */}
					<Text style={styles.conditionText}>{condition.text}</Text>

					{/* Key Metrics Grid */}
					<View style={styles.metricsContainer}>
						{/* Wind & Gusts */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="weather-windy" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Wind</Text>
								<Text style={styles.metricValue}>
									{Math.round(current.wind_kph)} km/h {current.wind_dir}
								</Text>
								{current.gust_kph > current.wind_kph && (
									<Text style={styles.metricSubtext}>Gusts {Math.round(current.gust_kph)} km/h</Text>
								)}
							</View>
						</View>

						{/* Feels Like */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="thermometer" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Feels Like</Text>
								<Text style={styles.metricValue}>{Math.round(current.feelslike_c)}°</Text>
							</View>
						</View>

						{/* Humidity */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="water-outline" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Humidity</Text>
								<Text style={styles.metricValue}>{current.humidity}%</Text>
							</View>
						</View>

						{/* UV Index */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="white-balance-sunny" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>UV Index</Text>
								<Text style={styles.metricValue}>{current.uv}</Text>
							</View>
						</View>

						{/* Pressure */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="gauge" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Pressure</Text>
								<Text style={styles.metricValue}>{current.pressure_mb} hPa</Text>
							</View>
						</View>

						{/* Visibility */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="eye-outline" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Visibility</Text>
								<Text style={styles.metricValue}>{current.vis_km} km</Text>
							</View>
						</View>

						{/* Precipitation */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="weather-rainy" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Precipitation</Text>
								<Text style={styles.metricValue}>{current.precip_mm} mm</Text>
							</View>
						</View>

						{/* Cloud Cover */}
						<View style={styles.metricCard}>
							<MaterialCommunityIcons name="weather-cloudy" size={20} color="#0284c7" />
							<View style={styles.metricInfo}>
								<Text style={styles.metricLabel}>Cloud Cover</Text>
								<Text style={styles.metricValue}>{current.cloud}%</Text>
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
	metricSubtext: {
		color: '#64748b',
		fontSize: 11,
		marginTop: 1,
	},
});
