import React from 'react';
import {View, ActivityIndicator, Text, ScrollView, useWindowDimensions, Pressable} from 'react-native';
import {Link} from 'expo-router';
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
import {useApiFetch} from '~/core/useApiFetch';
import {styles} from '~/layout/Home/styles';

export function Home() {
	const {width} = useWindowDimensions();
	const isMobile = width < 768;

	const weather = useWeather();
	const reduxWarnings = useWeatherWarnings();
	const lunar = useLunar();
	const coords = useLocation();

	const {data: warningsData} = useApiFetch('environment', 'WeatherController', 'getWarnings', coords ? {lat: coords.lat, lon: coords.lon} : null);

	const warnings = warningsData && warningsData.length > 0 ? warningsData : reduxWarnings;

	const {data: pointOfInterestData} = useApiFetch(
		'location',
		'PointOfInterestController',
		'getNearby',
		coords ? {lat: coords.lat, lon: coords.lon, limit: 5} : null,
	);

	const {data: newestLocationsData} = useApiFetch('location', 'PointOfInterestController', 'getNewest', {limit: 5});

	const {data: topImagesData} = useApiFetch('location', 'ImageController', 'topImages', {});
	const {data: permissionData} = useApiFetch('user', 'SubscriptionController', 'getPermissions', {});

	const isCoreReady = !!weather && !!lunar;

	if (!isCoreReady) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	const canUseCompass = !!permissionData?.navigation.useCompass;
	const canUseFlashlight = !!permissionData?.navigation.useFlashlight;
	const canUseSignal = !!permissionData?.navigation.useSignal;
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
								<Link href="/map" asChild>
									<Pressable style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
										<Text style={styles.sectionAction}>See More</Text>
									</Pressable>
								</Link>
							</View>
							<View style={styles.pointOfInterestsSection}>
								{!pointOfInterestData ? (
									<View style={styles.loadingCard}>
										<ActivityIndicator size="small" color="#ffffff" />
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
										<SeeMoreCard href="/map" title="See More" subtitle="Explore all on map" />
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
								<Link href="/map" asChild>
									<Pressable style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
										<Text style={styles.sectionAction}>See More</Text>
									</Pressable>
								</Link>
							</View>
							<View style={styles.pointOfInterestsSection}>
								{!newestLocationsData ? (
									<View style={styles.loadingCard}>
										<ActivityIndicator size="small" color="#ffffff" />
									</View>
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
										<SeeMoreCard href="/map" title="See More" subtitle="Explore all on map" />
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
				<View style={styles.sectionContainer}>
					<View style={styles.environmentGrid}>
						<View style={styles.gridRow}>
							<View style={styles.weatherSection}>
								<WeatherWidget data={weather} />
							</View>
							<View style={styles.lunarSection}>
								<LunarWidget data={lunar} />
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
