import {ScrollView, Text, View} from 'react-native';
import {ForecastType} from '@northernexplorer/types';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';

type ForecastProps = {
	data: ForecastType;
};

export function Forecast({data}: ForecastProps) {
	const daily = data.forecast.forecastday.slice(0, 5);

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			{daily.map(f => {
				const iconCode = String(f.day.condition.code);
				const iconName = getWeatherIcon(iconCode);
				const localDate = new Date(`${f.date}T00:00:00`);

				return (
					<View key={f.date_epoch} style={[styles.tile, {width: 80, padding: 5}]}>
						<Text style={styles.hourDay}>
							{localDate.toLocaleDateString('en-CA', {
								weekday: 'short',
							})}
						</Text>

						<MaterialCommunityIcons name={iconName} size={28} color="#fff" style={{marginVertical: 8}} />

						<View style={{alignItems: 'center'}}>
							<Text style={styles.hourTemp}>{Math.round(f.day.maxtemp_c)}°</Text>
							<Text style={[styles.hourTemp, {fontSize: 12, opacity: 0.6, marginTop: 2}]}>{Math.round(f.day.mintemp_c)}°</Text>
						</View>
					</View>
				);
			})}
		</ScrollView>
	);
}
