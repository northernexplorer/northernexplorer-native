import React from 'react';
import {View, ActivityIndicator, Text, ScrollView} from 'react-native';
import {WeatherWidget} from './components/WeatherWidget';
import {LunarWidget} from './components/LunarWidget';
import {FieldNoteWidget} from './components/FieldNoteWidget';
import {CompassWidget} from '~/layout/Home/components/CompassWidget';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {TopImagesWidget} from '~/layout/Home/components/TopImagesWidget';
import {FlashlightWidget} from '~/layout/Home/components/FlashlightWidget';
import {SignalWidget} from '~/layout/Home/components/SignalWidget';
import {useWeather} from '~/environment/state/weather/useWeather';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';
import {useLocation} from '~/location/state/location/useLocation';
import {useApiFetch} from '~/core/useApiFetch';
import {styles} from '~/layout/Home/styles';

export function Home() {
	const weather = useWeather();
	const lunar = useLunar();
	const fieldNote = useFieldNote();
	const coords = useLocation();

	const {data: pointOfInterestData} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearbyPointOfInterests',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 5} : null,
	);

	const {data: topImagesData} = useApiFetch('location', 'ImageController', 'topImages', {});
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	const isCoreReady = !!weather && !!lunar && !!fieldNote;

	if (!isCoreReady) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#38BDF8" />
			</View>
		);
	}

	const canUseCompass = !!permissionData?.navigation.useCompass;
	const canUseFlashlight = !!permissionData?.navigation.useFlashlight;
	const canUseSignal = !!permissionData?.navigation.useSignal;
	const hasTools = canUseSignal || canUseCompass || canUseFlashlight;

	return (
		<View style={styles.container}>
			{/* Left Vertical Action Bar */}
			{hasTools && (
				<View style={styles.leftSidebar}>
					<Text style={styles.sidebarLabel}>TOOLS</Text>
					<View style={styles.sidebarTools}>
						{canUseSignal && (
							<View style={styles.sidebarTile}>
								<SignalWidget />
							</View>
						)}
						{canUseCompass && (
							<View style={styles.sidebarTile}>
								<CompassWidget />
							</View>
						)}
						{canUseFlashlight && (
							<View style={styles.sidebarTile}>
								<FlashlightWidget />
							</View>
						)}
					</View>
				</View>
			)}

			{/* Main Dashboard Content */}
			<ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<View style={styles.headerRow}>
					<View>
						<Text style={styles.headerSubtitle}>FIELD DASHBOARD</Text>
						<Text style={styles.headerTitle}>Explore Nearby</Text>
					</View>
				</View>

				{/* Top Feature Block: Points of Interest */}
				<View style={styles.sectionContainer}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>Featured Destinations</Text>
					</View>
					<View style={styles.pointOfInterestsSection}>
						{!pointOfInterestData ? (
							<View style={styles.loadingCard}>
								<ActivityIndicator size="small" color="#38BDF8" />
							</View>
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
										difficulty={site.difficulty}
										rating={site.rating}
										reviews={site.reviews}
									/>
								))}
							</ScrollView>
						)}
					</View>
				</View>

				{/* Community Top Images Section */}
				{topImagesData && topImagesData.length > 0 && (
					<View style={styles.sectionContainer}>
						<Text style={styles.sectionTitle}>Top Captures</Text>
						<TopImagesWidget data={topImagesData} />
					</View>
				)}

				{/* Environment Highlights Grid */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Environmental Conditions</Text>
					<View style={styles.environmentGrid}>
						<View style={styles.gridRow}>
							<View style={styles.weatherSection}>
								<WeatherWidget data={weather} />
							</View>
							<View style={styles.lunarSection}>
								<LunarWidget data={lunar} />
							</View>
						</View>

						<View style={styles.gridRow}>
							<View style={styles.fieldNoteSection}>
								<FieldNoteWidget data={fieldNote} />
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
