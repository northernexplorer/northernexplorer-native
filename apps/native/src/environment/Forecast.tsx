import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {useForecast} from '~/environment/state/forecast/useForecast';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function Forecast() {
	const forecast = useForecast();

	if (!forecast) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.centerContainer}>
					<Spinner />
				</View>
			</SafeAreaView>
		);
	}

	const daily = forecast.forecast.forecastday.slice(0, 7);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Header Label */}
				<Text style={styles.pageTitle}>3-Day Forecast</Text>

				{/* Vertical Forecast List */}
				<View style={styles.forecastList}>
					{daily.map((f, index) => {
						const iconName = getWeatherIcon(String(f.day.condition.code));
						const localDate = new Date(`${f.date}T00:00:00`);
						const isToday = index === 0;

						const dayLabel = isToday ? 'Today' : localDate.toLocaleDateString('en-CA', {weekday: 'short'});

						return (
							<View key={f.date_epoch} style={styles.row}>
								{/* Day Name */}
								<View style={styles.dayColumn}>
									<Text style={[styles.dayText, isToday && styles.todayText]}>{dayLabel}</Text>
									<Text style={styles.dateSubtext}>
										{localDate.toLocaleDateString('en-CA', {month: 'numeric', day: 'numeric'})}
									</Text>
								</View>

								{/* Condition Icon & Description */}
								<View style={styles.conditionColumn}>
									<MaterialCommunityIcons name={iconName} size={28} color="#0f172a" />
									<Text style={styles.conditionText} numberOfLines={1}>
										{f.day.condition.text}
									</Text>
								</View>

								{/* Temperature Range */}
								<View style={styles.tempColumn}>
									<Text style={styles.maxTemp}>{Math.round(f.day.maxtemp_c)}°</Text>
									<Text style={styles.minTemp}>{Math.round(f.day.mintemp_c)}°</Text>
								</View>
							</View>
						);
					})}
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
		paddingHorizontal: 20,
		paddingVertical: 28,
	},
	pageTitle: {
		color: '#475569',
		fontSize: 13,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 1.2,
		marginBottom: 16,
		paddingLeft: 4,
	},
	forecastList: {
		borderRadius: 20,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0, 0, 0, 0.08)',
		paddingHorizontal: 16,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 14,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(0, 0, 0, 0.06)',
	},
	dayColumn: {
		width: 70,
	},
	dayText: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '600',
	},
	todayText: {
		color: '#0284c7',
		fontWeight: '700',
	},
	dateSubtext: {
		color: '#64748b',
		fontSize: 11,
		marginTop: 2,
	},
	conditionColumn: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingHorizontal: 12,
	},
	conditionText: {
		color: '#334155',
		fontSize: 14,
		fontWeight: '500',
		flexShrink: 1,
	},
	tempColumn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		justifyContent: 'flex-end',
		minWidth: 60,
	},
	maxTemp: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '700',
	},
	minTemp: {
		color: '#64748b',
		fontSize: 14,
		fontWeight: '500',
	},
});
