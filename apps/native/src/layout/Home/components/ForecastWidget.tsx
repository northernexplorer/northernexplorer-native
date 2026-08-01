import React from 'react';
import {ScrollView, Text, View, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {ForecastType} from '@northernexplorer/types';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';

export function ForecastWidget({data}: {data: ForecastType}) {
	const daily = data.forecast.forecastday.slice(0, 5);

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			{daily.map(f => {
				const iconName = getWeatherIcon(String(f.day.condition.code));
				const localDate = new Date(`${f.date}T00:00:00`);

				return (
					<Link key={f.date_epoch} href="/environment/forecast" asChild>
						<Pressable
							style={{
								...styles.tile,
								...styles.forecastTile,
							}}
						>
							<Text style={styles.hourDay}>{localDate.toLocaleDateString('en-CA', {weekday: 'short'})}</Text>

							<MaterialCommunityIcons name={iconName} size={30} color="#ffffff" style={{marginVertical: 10}} />

							<View style={{alignItems: 'center', gap: 2}}>
								<Text style={styles.hourTemp}>{Math.round(f.day.maxtemp_c)}°</Text>
								<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600'}}>{Math.round(f.day.mintemp_c)}°</Text>
							</View>
						</Pressable>
					</Link>
				);
			})}
		</ScrollView>
	);
}
