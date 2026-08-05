import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {useForecast} from '~/environment/state/forecast/useForecast';
import {Spinner} from '~/layout/Layout/elements/Spinner';

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
				{/* Forecast List */}
				<View style={styles.forecastList}>
					{daily.map((f, index) => {
						const iconName = getWeatherIcon(String(f.day.condition.code));
						const localDate = new Date(`${f.date}T00:00:00`);
						const isToday = index === 0;

						const dayLabel = isToday ? 'Today' : localDate.toLocaleDateString('en-CA', {weekday: 'short'});

						return (
							<React.Fragment key={f.date_epoch}>
								{index > 0 && <View style={styles.divider} />}
								<View style={styles.row}>
									{/* Day Name & Date */}
									<View style={styles.dayColumn}>
										<Text style={styles.dayText}>{dayLabel}</Text>
										<Text style={styles.dateSubtext}>
											{localDate.toLocaleDateString('en-CA', {month: 'numeric', day: 'numeric'})}
										</Text>
									</View>

									{/* Condition Icon & Description */}
									<View style={styles.conditionColumn}>
										<MaterialCommunityIcons name={iconName} size={28} color="#64748b" />
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
							</React.Fragment>
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
		paddingHorizontal: 24,
		paddingVertical: 16,
	},
	forecastList: {
		width: '100%',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'rgba(15, 23, 42, 0.1)',
		width: '100%',
	},
	dayColumn: {
		width: 70,
	},
	dayText: {
		color: '#0f172a',
		fontSize: 16,
		fontWeight: '600',
	},
	dateSubtext: {
		color: '#64748b',
		fontSize: 12,
		marginTop: 2,
	},
	conditionColumn: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 12,
	},
	conditionText: {
		color: '#475569',
		fontSize: 15,
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
