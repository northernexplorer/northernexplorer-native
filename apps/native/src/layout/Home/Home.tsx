import {View, ActivityIndicator, useWindowDimensions, Text, ScrollView} from 'react-native';
import {Weather} from './components/Weather';
import {Forecast} from './components/Forecast';
import {Lunar} from './components/Lunar';
import {FieldNote} from './components/FieldNote';
import {useWeather} from '~/environment/state/weather/useWeather';
import {useForecast} from '~/environment/state/forecast/useForecast';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';
import {styles} from '~/layout/Home/styles';
import {HistoricSitePreview} from '~/layout/Home/components/HistoricSitePreview';
import {useLocation} from '~/location/state/location/useLocation';
import {useApiFetch} from '~/core/useApiFetch';

export function Home() {
	const weather = useWeather();
	const forecast = useForecast();
	const lunar = useLunar();
	const fieldNote = useFieldNote();
	const coords = useLocation();

	// Only query when valid coordinates exist
	const historicSites = useApiFetch(
		'location',
		'HistoricSiteController',
		'getNearbyHistoricSites',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 5} : null,
	);

	const {width} = useWindowDimensions();
	const isMobileView = width < 1000;

	// Critical weather data readiness check
	const isCoreReady = !!weather && !!forecast && !!lunar && !!fieldNote;

	if (!isCoreReady) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 24}} showsVerticalScrollIndicator={false}>
			{isMobileView ? (
				<View style={{gap: 12}}>
					<View style={styles.mobileHeroRow}>
						<View style={styles.weatherSection}>
							<Weather data={weather} />
						</View>

						<View style={styles.mobileLunarSection}>
							<Lunar data={lunar} />
						</View>
					</View>

					<View style={styles.mobileFieldNoteSection}>
						<FieldNote data={fieldNote} />
					</View>
				</View>
			) : (
				<View style={styles.heroRow}>
					<View style={styles.weatherSection}>
						<Weather data={weather} />
					</View>

					<View style={styles.fieldNote}>
						<FieldNote data={fieldNote} />
					</View>

					<View style={styles.lunarSection}>
						<Lunar data={lunar} />
					</View>
				</View>
			)}

			<Text style={styles.exploreHeader}>Plan Ahead...</Text>
			<View style={styles.forecastSection}>
				<Forecast data={forecast} />
			</View>

			<Text style={styles.exploreHeader}>Start Exploring...</Text>
			<View style={styles.historicSitesSection}>
				{!historicSites?.data ? (
					<ActivityIndicator size="small" color="#ffffff" style={{marginVertical: 20}} />
				) : (
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12, paddingHorizontal: 16}}>
						{historicSites.data.map(site => (
							<HistoricSitePreview
								key={site.id}
								name={site.name}
								description={site.description}
								image={site.image}
								country={site.country?.name}
								region={site.region?.name}
								id={site.id}
							/>
						))}
					</ScrollView>
				)}
			</View>
		</ScrollView>
	);
}
