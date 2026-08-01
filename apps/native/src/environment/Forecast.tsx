import {ScrollView, Text, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';
import {getWeatherIcon} from '~/layout/Layout/getWeatherIcon';
import {useForecast} from '~/environment/state/forecast/useForecast';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function Forecast() {
	const forecast = useForecast();

	if (!forecast) return <Spinner />;

	const daily = forecast.forecast.forecastday.slice(0, 5);

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			{daily.map(f => {
				const iconName = getWeatherIcon(String(f.day.condition.code));
				const localDate = new Date(`${f.date}T00:00:00`);

				return (
					<View key={f.date_epoch} style={[styles.tile, styles.forecastTile]}>
						<Text style={styles.hourDay}>{localDate.toLocaleDateString('en-CA', {weekday: 'short'})}</Text>

						<MaterialCommunityIcons name={iconName} size={30} color="#ffffff" style={{marginVertical: 10}} />

						<View style={{alignItems: 'center', gap: 2}}>
							<Text style={styles.hourTemp}>{Math.round(f.day.maxtemp_c)}°</Text>
							<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600'}}>{Math.round(f.day.mintemp_c)}°</Text>
						</View>
					</View>
				);
			})}
		</ScrollView>
	);
}
