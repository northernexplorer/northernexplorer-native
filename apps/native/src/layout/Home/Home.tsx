import React from 'react';
import {View, ActivityIndicator, Text, ScrollView, useWindowDimensions} from 'react-native';
import {WeatherWidget} from './components/WeatherWidget';
import {WeatherWarningsWidget} from './components/WeatherWarningsWidget';
import {LunarWidget} from './components/LunarWidget';
import {CompassWidget} from '~/layout/Home/components/CompassWidget';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {TopImagesWidget} from '~/layout/Home/components/TopImagesWidget';
import {FlashlightWidget} from '~/layout/Home/components/FlashlightWidget';
import {SignalWidget} from '~/layout/Home/components/SignalWidget';
import {useWeather} from '~/environment/state/weather/useWeather';
import {useWeatherWarnings} from '~/environment/state/weather/useWeatherWarnings';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {useLocation} from '~/location/state/location/useLocation';
import {useApiFetch} from '~/core/useApiFetch';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {styles} from '~/layout/Home/styles';

export function Home() {
	const {width} = useWindowDimensions();
	const isMobile = width < 768;
	const {isOffline} = useIsOffline();

	const weather = useWeather();
	const reduxWarnings = useWeatherWarnings();
	const lunar = useLunar();
	const coords = useLocation();

	const {data: warningsData} = useApiFetch('environment', 'WeatherController', 'getWarnings', coords ? {lat: coords.lat, lon: coords.lon} : null);

	const warnings = warningsData && warningsData.length > 0 ? warningsData : reduxWarnings;

	const {data: pointOfInterestData, loading: poiLoading} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearby',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 10} : null,
	);

	const {data: topImagesData} = useApiFetch('location', 'ImageController', 'topImages', {});
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	// Prefetch map data and geography data in background when online to maximize cached data for offline use
	useApiFetch('location', 'PointOfInterestController', 'getForMap', coords ? {lat: coords.lat, lon: coords.lon, limit: 500} : null, {
		skip: isOffline,
	});
	useApiFetch('location', 'CountryController', 'getAll', {}, {skip: isOffline});
	useApiFetch('location', 'RegionController', 'getAll', {}, {skip: isOffline});
	useApiFetch('location', 'OrganizationController', 'getAll', {}, {skip: isOffline});

	const isCoreReady = !!weather && !!lunar;
	const isInitialLoading = !isOffline && !isCoreReady && !coords;

	if (isInitialLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	const canUseCompass = permissionData ? !!permissionData.navigation.useCompass : true;
	const canUseFlashlight = permissionData ? !!permissionData.navigation.useFlashlight : true;
	const canUseSignal = permissionData ? !!permissionData.navigation.useSignal : true;
	const hasTools = canUseSignal || canUseCompass || canUseFlashlight;

	return (
		<View style={[styles.container, isMobile && styles.containerMobile]}>
			{/* Action Bar: Top on Mobile, Left Sidebar on Desktop */}
			{hasTools && (
				<View style={isMobile ? styles.topBar : styles.leftSidebar}>
					<View style={isMobile ? styles.topBarTools : styles.sidebarTools}>
						{canUseSignal && (
							<View style={isMobile ? styles.topBarTile : styles.sidebarTile}>
								<SignalWidget />
							</View>
						)}
						{canUseCompass && (
							<View style={isMobile ? styles.topBarTile : styles.sidebarTile}>
								<CompassWidget />
							</View>
						)}
						{canUseFlashlight && (
							<View style={isMobile ? styles.topBarTile : styles.sidebarTile}>
								<FlashlightWidget />
							</View>
						)}
					</View>
				</View>
			)}

			{/* Main Dashboard Content */}
			<ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Active Weather Warnings Banner */}
				{warnings.length > 0 && (
					<View style={styles.sectionContainer}>
						<WeatherWarningsWidget warnings={warnings} />
					</View>
				)}

				{/* Featured Destinations Container Card */}
				<View style={styles.sectionContainer}>
					<View style={styles.tile}>
						<View style={{padding: 16}}>
							<View style={{marginBottom: 8}}>
								<Text style={[styles.headerSubtitle, {fontSize: 10, letterSpacing: 1}]}>FEATURED</Text>
								<Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>Destinations</Text>
							</View>
							<View style={styles.pointOfInterestsSection}>
								{!pointOfInterestData ? (
									poiLoading ? (
										<View style={styles.loadingCard}>
											<ActivityIndicator size="small" color="#ffffff" />
										</View>
									) : (
										<View style={[styles.loadingCard, {padding: 12}]}>
											<Text style={{color: '#94a3b8', fontSize: 13}}>No destinations available offline.</Text>
										</View>
									)
								) : pointOfInterestData.length === 0 ? (
									<View style={[styles.loadingCard, {padding: 12}]}>
										<Text style={{color: '#94a3b8', fontSize: 13}}>No destinations found.</Text>
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
					</View>
				</View>

				{/* Top Captures Container Card */}
				{topImagesData && topImagesData.length > 0 && (
					<View style={styles.sectionContainer}>
						<View style={styles.tile}>
							<View style={{padding: 16}}>
								<View style={{marginBottom: 8}}>
									<Text style={[styles.headerSubtitle, {fontSize: 10, letterSpacing: 1}]}>COMMUNITY</Text>
									<Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>Top Captures</Text>
								</View>
								<TopImagesWidget data={topImagesData} />
							</View>
						</View>
					</View>
				)}

				{/* Environment Highlights Grid */}
				{(weather || lunar) && (
					<View style={styles.sectionContainer}>
						<View style={styles.environmentGrid}>
							<View style={styles.gridRow}>
								{weather && (
									<View style={styles.weatherSection}>
										<WeatherWidget data={weather} />
									</View>
								)}
								{lunar && (
									<View style={styles.lunarSection}>
										<LunarWidget data={lunar} />
									</View>
								)}
							</View>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}
