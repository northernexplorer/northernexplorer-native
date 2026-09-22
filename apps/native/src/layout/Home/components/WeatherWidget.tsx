import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {WeatherType} from '@northernexplorer/types';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {styles} from '~/layout/Home/styles';

export function WeatherWidget({data}: {data: WeatherType}) {
	const current = data.current;
	const condition = current.condition;
	const iconName = getWeatherIcon(String(condition.code));

	return (
		<Link href="/environment/weather" asChild>
			<Pressable style={{...styles.tile, padding: 16, justifyContent: 'space-between', flex: 1}}>
				<View>
					<Text style={styles.hourDay} numberOfLines={1}>
						{data.location.name}
					</Text>

					<View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 6, gap: 12}}>
						<MaterialCommunityIcons name={iconName} size={44} color="#38BDF8" />
						<Text style={{color: '#FFFFFF', fontSize: 48, fontWeight: '300', letterSpacing: -1}}>{Math.round(current.temp_c)}°</Text>
					</View>

					<Text style={{color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 12}} numberOfLines={1}>
						{condition.text}
					</Text>
				</View>

				<View style={{flexDirection: 'row', gap: 6, flexWrap: 'wrap'}}>
					<View style={styles.metricPill}>
						<MaterialCommunityIcons name="weather-windy" size={13} color="#38BDF8" />
						<Text style={styles.metricText}>{Math.round(current.wind_kph)} km/h</Text>
					</View>
					<View style={styles.metricPill}>
						<MaterialCommunityIcons name="water-outline" size={13} color="#38BDF8" />
						<Text style={styles.metricText}>{current.humidity}%</Text>
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
