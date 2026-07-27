import {ComponentType, useState} from 'react';
import {ImageBackground, Pressable, ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from './styles';
import {getWeatherTheme} from '~/layout/Layout/getWeatherTheme';
import {useWeather} from '~/environment/state/weather/useWeather';
import {Sidebar} from '~/layout/Layout/components/Sidebar';
import {Navigation} from '~/layout/Layout/components/Navigation';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {Offline} from '~/layout/Layout/components/Offline';

interface Props {
	Content: ComponentType;
	sidebar?: ComponentType[];
	title?: string;
	fullPage?: boolean;
	home?: boolean;
	showOffline?: boolean;
}

export function Layout({Content, title, sidebar, fullPage, home, showOffline}: Props) {
	const {width} = useWindowDimensions();
	const isOffline = useIsOffline();
	const isMobileView = width < 1000;
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);

	const weather = useWeather();
	const theme = weather ? getWeatherTheme(weather.current.condition.code) : null;

	const online = !isOffline || !!showOffline;
	const isMobileFullPage = fullPage && isMobileView;

	return (
		<View style={{flex: 1, width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden'}}>
			<Navigation />

			<ScrollView
				scrollEnabled={!fullPage}
				style={{flex: 1}}
				contentContainerStyle={[
					styles.page,
					{
						flexDirection: isMobileView ? 'column' : 'row',
						height: fullPage ? '100%' : 'auto',
					},
				]}
				keyboardShouldPersistTaps="handled"
			>
				<View style={{flex: 1, width: '100%', alignSelf: 'stretch', position: 'relative'}}>
					{online && (
						<ImageBackground
							style={[styles.background, {alignSelf: 'stretch', flex: 1}]}
							source={home ? theme?.image : undefined}
							imageStyle={{
								width: '100%',
								height: '100%',
							}}
						>
							{home && <View style={styles.darkOverlay} />}

							<View
								style={{
									flex: 1,
									padding: fullPage ? 0 : 10,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{title && <Text style={[styles.title, fullPage && {paddingHorizontal: 10, paddingTop: 10}]}>{title}</Text>}

								<View style={{flex: 1, display: 'flex', width: '100%'}}>
									<Content />
								</View>
							</View>
						</ImageBackground>
					)}
					{!online && <Offline />}

					{/* Mobile FullPage Floating Sidebar Button & Card */}
					{isMobileFullPage && sidebar && sidebar.length > 0 && (
						<>
							<Pressable
								onPress={() => setIsSidebarVisible(prev => !prev)}
								style={{
									position: 'absolute',
									bottom: 20,
									right: 20,
									zIndex: 20,
									backgroundColor: '#1a1a1a',
									borderWidth: 1,
									borderColor: '#333333',
									width: 48,
									height: 48,
									borderRadius: 12,
									justifyContent: 'center',
									alignItems: 'center',
									elevation: 6,
								}}
							>
								<MaterialCommunityIcons name={isSidebarVisible ? 'close' : 'view-dashboard-outline'} size={24} color="#ffffff" />
							</Pressable>

							{isSidebarVisible && (
								<View
									style={{
										position: 'absolute',
										bottom: 76,
										left: 12,
										right: 12,
										maxHeight: '60%',
										backgroundColor: '#1a1a1a',
										borderRadius: 12,
										borderWidth: 1,
										borderColor: '#333333',
										padding: 16,
										zIndex: 15,
										elevation: 8,
									}}
								>
									<ScrollView nestedScrollEnabled style={{maxHeight: '100%'}}>
										<Sidebar components={sidebar} />
									</ScrollView>
								</View>
							)}
						</>
					)}
				</View>

				{/* Standard Sidebar for non-mobile or non-fullPage */}
				{!isMobileFullPage && (
					<View style={[styles.sidebar, isMobileView ? styles.sidebarMobile : [styles.sidebarDesktop, {alignSelf: 'stretch'}]]}>
						<Sidebar components={sidebar} />
					</View>
				)}
			</ScrollView>
		</View>
	);
}
