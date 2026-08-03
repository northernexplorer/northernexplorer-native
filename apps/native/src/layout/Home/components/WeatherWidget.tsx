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
			<Pressable style={{...styles.hero}}>
				<Text style={{color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8}}>
					{data.location.name}
				</Text>

				<View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 4, gap: 12}}>
					<MaterialCommunityIcons name={iconName} size={52} color="#ffffff" />
					<Text style={{color: '#ffffff', fontSize: 56, fontWeight: '200', letterSpacing: -1}}>{Math.round(current.temp_c)}°</Text>
				</View>

				<Text style={{color: '#ffffff', fontSize: 15, fontWeight: '500', marginBottom: 14}}>{condition.text}</Text>

				<View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
					<View style={styles.metricPill}>
						<MaterialCommunityIcons name="weather-windy" size={14} color="rgba(255,255,255,0.7)" />
						<Text style={styles.metricText}>{Math.round(current.wind_kph)} km/h</Text>
					</View>
					<View style={styles.metricPill}>
						<MaterialCommunityIcons name="water-outline" size={14} color="rgba(255,255,255,0.7)" />
						<Text style={styles.metricText}>{current.humidity}%</Text>
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
