import {ComponentType, useState} from 'react';
import {ImageBackground, Pressable, ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from './styles';
import {getWeatherTheme} from '~/layout/Layout/getWeatherTheme';
import {useWeather} from '~/environment/state/weather/useWeather';
import {Sidebar} from '~/layout/Layout/components/Sidebar';
import {Navigation} from '~/layout/Layout/components/Navigation';
import {Footer} from '~/layout/Layout/components/Footer';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {Offline} from '~/layout/Layout/components/Offline';
import {Update} from '~/layout/Layout/components/Update';

interface Props {
	Content: ComponentType;
	sidebar?: ComponentType[];
	title?: string;
	subtitle?: string;
	fullPage?: boolean;
	home?: boolean;
	showOffline?: boolean;
	disableScroll?: boolean;
}

export function Layout({Content, title, subtitle, sidebar, fullPage, home, showOffline, disableScroll}: Props) {
	const {width} = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const {isOffline, isRequiredAppUpdate} = useIsOffline();
	const isMobileView = width < 1000;
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);

	const weather = useWeather();
	const theme = weather ? getWeatherTheme(weather.current.condition.code) : null;

	const online = !isOffline || !!showOffline;
	const isMobileFullPage = fullPage && isMobileView;

	const floatingButtonBottom = (insets.bottom || 0) + 20;
	const floatingMenuBottom = (insets.bottom || 0) + 76;

	if (isRequiredAppUpdate) return <Update />;

	return (
		<View style={{flex: 1, width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden'}}>
			<Navigation />

			<ScrollView
				style={{flex: 1}}
				scrollEnabled={!disableScroll}
				contentContainerStyle={{
					flexGrow: 1,
					minHeight: fullPage ? '100%' : '100%',
				}}
				keyboardShouldPersistTaps="handled"
			>
				{/* Master Wrapper Row */}
				<View
					style={{
						flex: 1,
						flexGrow: 1,
						width: '100%',
						flexDirection: isMobileView ? 'column' : 'row',
						alignItems: 'stretch',
					}}
				>
					{/* Main Left Content Area */}
					<View style={{flex: 1, minWidth: 0, flexDirection: 'column', position: 'relative'}}>
						{online && (
							<ImageBackground
								style={[styles.background, {flex: 1, width: '100%'}]}
								source={home ? theme?.image : undefined}
								imageStyle={{
									width: '100%',
									height: '100%',
								}}
							>
								{home && <View style={styles.darkOverlay} />}

								{/* Padded Content Wrapper */}
								<View
									style={{
										flex: 1,
										padding: fullPage ? 0 : 10,
										flexDirection: 'column',
									}}
								>
									{!fullPage && (
										<View style={{paddingBottom: 10}}>
											{title && <Text style={styles.title}>{title}</Text>}
											{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
										</View>
									)}

									<View style={{flex: 1, width: '100%'}}>
										<Content />
									</View>
								</View>

								{/* Desktop Footer: Outside the padded View so it spans edge-to-edge */}
								{!fullPage && !isMobileView && <Footer />}
							</ImageBackground>
						)}
						{!online && <Offline />}

						{/* Mobile FullPage Floating Sidebar */}
						{isMobileFullPage && sidebar && sidebar.length > 0 && (
							<>
								<Pressable
									onPress={() => setIsSidebarVisible(prev => !prev)}
									style={{
										position: 'absolute',
										bottom: floatingButtonBottom,
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
											bottom: floatingMenuBottom,
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

					{/* Sidebar Column */}
					{!isMobileFullPage && (
						<View style={[styles.sidebar, isMobileView ? styles.sidebarMobile : styles.sidebarDesktop]}>
							<Sidebar components={sidebar} />
						</View>
					)}

					{/* Mobile Footer */}
					{!fullPage && isMobileView && <Footer />}
				</View>
			</ScrollView>
		</View>
	);
}
