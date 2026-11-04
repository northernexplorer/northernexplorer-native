import React, {useEffect} from 'react';
import {View, ActivityIndicator, Text, ScrollView, useWindowDimensions} from 'react-native';
import {WeatherWidget} from './components/WeatherWidget';
import {WeatherWarningsWidget} from './components/WeatherWarningsWidget';
import {LunarWidget} from './components/LunarWidget';
import {DownloadAppWidget} from './components/DownloadAppWidget';
import {CompassWidget} from '~/layout/Home/components/CompassWidget';
import {PointOfInterestPreviewWidget} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {SeeMoreCard} from '~/layout/Home/components/SeeMoreCard';
import {TopImagesWidget} from '~/layout/Home/components/TopImagesWidget';
import {FlashlightWidget} from '~/layout/Home/components/FlashlightWidget';
import {SignalWidget} from '~/layout/Home/components/SignalWidget';
import {useWeather} from '~/environment/state/weather/useWeather';
import {useWeatherWarnings} from '~/environment/state/weather/useWeatherWarnings';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {useLocation} from '~/location/state/location/useLocation';
import {usePermissions} from '~/user/state/subscription';
import {useApiFetch} from '~/core/useApiFetch';
import {useAppDispatch, useAppSelector} from '~/core/storeHooks';
import {setNearbyLocations, setNewestLocations, setTopImages, selectHomeData} from '~/layout/Home/homeSlice';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {styles} from '~/layout/Home/styles';

export function Home() {
	const {width} = useWindowDimensions();
	const isMobile = width < 768;

	const weather = useWeather();
	const reduxWarnings = useWeatherWarnings();
	const lunar = useLunar();
	const coords = useLocation();
	const permissions = usePermissions();
	const dispatch = useAppDispatch();
	const cachedHomeData = useAppSelector(state => state.home);
	const {isOffline} = useIsOffline();

	const {data: warningsData} = useApiFetch('environment', 'WeatherController', 'getWarnings', coords ? {lat: coords.lat, lon: coords.lon} : null);

	const warnings = warningsData ?? reduxWarnings;

	const {data: fetchedNearbyLocations, loading: nearbyLocationsLoading} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearby',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 5} : null,
	);

	const {data: fetchedNewestLocations, loading: newestLocationsLoading} = useApiFetch('location', 'PointOfInterestController', 'getNewest', {
		limit: 5,
	});

	const {data: fetchedTopImages, loading: topImagesLoading} = useApiFetch('location', 'ImageController', 'topImages', {});

	useEffect(() => {
		if (fetchedNearbyLocations !== null) {
			dispatch(setNearbyLocations(fetchedNearbyLocations));
		}
	}, [dispatch, fetchedNearbyLocations]);

	useEffect(() => {
		if (fetchedNewestLocations !== null) {
			dispatch(setNewestLocations(fetchedNewestLocations));
		}
	}, [dispatch, fetchedNewestLocations]);

	useEffect(() => {
		if (fetchedTopImages !== null) {
			dispatch(setTopImages(fetchedTopImages));
		}
	}, [dispatch, fetchedTopImages]);

	const pointOfInterestData = selectHomeData(fetchedNearbyLocations, cachedHomeData.nearbyLocations);
	const newestLocationsData = selectHomeData(fetchedNewestLocations, cachedHomeData.newestLocations);
	const topImagesData = selectHomeData(fetchedTopImages, cachedHomeData.topImages);

	const isCoreReady = !!weather && !!lunar;

	if (!isCoreReady && !isOffline) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	const canUseCompass = !!permissions?.navigation.useCompass;
	const canUseFlashlight = !!permissions?.navigation.useFlashlight;
	const canUseSignal = !!permissions?.navigation.useSignal;
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

				{/* Download App Widget */}
				<DownloadAppWidget />

				{/* Nearby Destinations Container Card */}
				<View style={styles.sectionContainer}>
					<View style={styles.tile}>
						<View style={{padding: 16}}>
							<View style={styles.sectionHeaderRow}>
								<View>
									<Text style={[styles.headerSubtitle, {fontSize: 10, letterSpacing: 1}]}>NEARBY</Text>
									<Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>Destinations</Text>
								</View>
							</View>
							<View style={styles.pointOfInterestsSection}>
								{pointOfInterestData === null ? (
									nearbyLocationsLoading && !isOffline ? (
										<View style={styles.loadingCard}>
											<ActivityIndicator size="small" color="#ffffff" />
										</View>
									) : (
										<View style={styles.emptyCard}>
											<Text style={styles.emptyText}>
												{isOffline
													? 'No cached nearby destinations are available offline.'
													: coords
														? 'Nearby destinations are unavailable.'
														: 'Location is unavailable.'}
											</Text>
										</View>
									)
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
										<SeeMoreCard href={{pathname: '/destinations', params: {sort: 'nearby'}}} title="See More" />
									</ScrollView>
								)}
							</View>
						</View>
					</View>
				</View>

				{/* Newest Locations Container Card */}
				<View style={styles.sectionContainer}>
					<View style={styles.tile}>
						<View style={{padding: 16}}>
							<View style={styles.sectionHeaderRow}>
								<View>
									<Text style={[styles.headerSubtitle, {fontSize: 10, letterSpacing: 1}]}>NEWEST</Text>
									<Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>Locations</Text>
								</View>
							</View>
							<View style={styles.pointOfInterestsSection}>
								{newestLocationsData === null ? (
									newestLocationsLoading && !isOffline ? (
										<View style={styles.loadingCard}>
											<ActivityIndicator size="small" color="#ffffff" />
										</View>
									) : (
										<View style={styles.emptyCard}>
											<Text style={styles.emptyText}>
												{isOffline ? 'No cached locations are available offline.' : 'Locations are unavailable.'}
											</Text>
										</View>
									)
								) : (
									<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 12}}>
										{newestLocationsData.map(site => (
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
										<SeeMoreCard href={{pathname: '/destinations', params: {sort: 'newest'}}} title="See More" />
									</ScrollView>
								)}
							</View>
						</View>
					</View>
				</View>

				{/* Top Captures Container Card */}
				{(topImagesData === null || topImagesData.length > 0) && (
					<View style={styles.sectionContainer}>
						<View style={styles.tile}>
							<View style={{padding: 16}}>
								<View style={{marginBottom: 8}}>
									<Text style={[styles.headerSubtitle, {fontSize: 10, letterSpacing: 1}]}>COMMUNITY</Text>
									<Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>Top Captures</Text>
								</View>
								{topImagesData === null ? (
									topImagesLoading && !isOffline ? (
										<View style={styles.loadingCard}>
											<ActivityIndicator size="small" color="#ffffff" />
										</View>
									) : (
										<View style={styles.emptyCard}>
											<Text style={styles.emptyText}>
												{isOffline ? 'No cached captures are available offline.' : 'Captures are unavailable.'}
											</Text>
										</View>
									)
								) : (
									<TopImagesWidget data={topImagesData} />
								)}
							</View>
						</View>
					</View>
				)}

				{/* Environment Highlights Grid */}
				<View style={styles.sectionContainer}>
					<View style={styles.environmentGrid}>
						<View style={styles.gridRow}>
							<View style={styles.weatherSection}>
								{weather ? (
									<WeatherWidget data={weather} />
								) : (
									<View style={styles.emptyCard}>
										<Text style={styles.emptyText}>Weather is unavailable offline.</Text>
									</View>
								)}
							</View>
							<View style={styles.lunarSection}>
								{lunar ? (
									<LunarWidget data={lunar} />
								) : (
									<View style={styles.emptyCard}>
										<Text style={styles.emptyText}>Lunar data is unavailable offline.</Text>
									</View>
								)}
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
