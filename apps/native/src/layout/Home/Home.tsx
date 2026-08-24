import React from 'react';
import {View, ActivityIndicator, Text, ScrollView} from 'react-native';
import {WeatherWidget} from './components/WeatherWidget';
import {ForecastWidget} from './components/ForecastWidget';
import {LunarWidget} from './components/LunarWidget';
import {FieldNoteWidget} from './components/FieldNoteWidget';
import {CompassWidget} from '~/layout/Home/components/CompassWidget';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {useWeather} from '~/environment/state/weather/useWeather';
import {useForecast} from '~/environment/state/forecast/useForecast';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';
import {useLocation} from '~/location/state/location/useLocation';
import {useApiFetch} from '~/core/useApiFetch';
import {styles} from '~/layout/Home/styles';
import {FlashlightWidget} from "~/layout/Home/components/FlashlightWidget";

export function Home() {
	const weather = useWeather();
	const forecast = useForecast();
	const lunar = useLunar();
	const fieldNote = useFieldNote();
	const coords = useLocation();

	const {data: pointOfInterestData} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearbyPointOfInterests',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 5} : null,
	);

	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	const isCoreReady = !!weather && !!forecast && !!lunar && !!fieldNote;

	if (!isCoreReady) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	const canUseCompass = !!permissionData?.navigation.useCompass;

	return (
		<View style={{width: '100%', padding: 10, paddingBottom: 32}}>
			<View style={{gap: 12}}>
				{/* Row 1: Weather (flex: 2) + Lunar (flex: 1) */}
				<View style={styles.heroRow}>
					<View style={styles.weatherSection}>
						<WeatherWidget data={weather} />
					</View>
					<View style={styles.lunarSection}>
						<LunarWidget data={lunar} />
					</View>
				</View>

				{/* Row 2: FieldNote (flex: 2) + Compass (flex: 1) */}
				<View style={styles.heroRow}>
					<View style={styles.fieldNote}>
						<FieldNoteWidget data={fieldNote} />
					</View>
					{canUseCompass && (
						<View style={styles.compassSection}>
							<CompassWidget />
						</View>
					)}
					{canUseCompass && (
						<View style={styles.compassSection}>
							<FlashlightWidget />
						</View>
					)}
				</View>
			</View>

			<Text style={styles.exploreHeader}>Plan Ahead...</Text>
			<View style={styles.forecastSection}>
				<ForecastWidget data={forecast} />
			</View>

			<Text style={styles.exploreHeader}>Start Exploring...</Text>
			<View style={styles.pointOfInterestsSection}>
				{!pointOfInterestData ? (
					<ActivityIndicator size="small" color="#ffffff" style={{marginVertical: 20}} />
				) : (
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12}}>
						{pointOfInterestData.map(site => (
							<PointOfInterestPreviewWidget
								key={site.id}
								name={site.name}
								description={site.description}
								image={site.image}
								country={site.country.name}
								region={site.region.name}
								id={site.id}
								latitude={site.lat}
								longitude={site.lon}
							/>
						))}
					</ScrollView>
				)}
			</View>
		</View>
	);
}
