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

	const floatingButtonBottom = (insets.bottom || 0) + 16;
	const floatingMenuBottom = floatingButtonBottom + 56;

	if (isRequiredAppUpdate) return <Update />;

	return (
		<View style={{flex: 1, width: '100%', maxWidth: '100%', minWidth: 0}}>
			<Navigation />

			<View style={{flex: 1, position: 'relative'}}>
				<ScrollView
					style={{flex: 1}}
					scrollEnabled={!disableScroll}
					contentContainerStyle={{
						flexGrow: 1,
						minHeight: '100%',
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
						<View style={{flex: 1, minWidth: 0, flexDirection: 'column'}}>
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

									{/* Desktop Footer */}
									{!fullPage && !isMobileView && <Footer />}
								</ImageBackground>
							)}
							{!online && <Offline />}
						</View>

						{/* Standard Sidebar Column */}
						{!isMobileFullPage && (
							<View style={[styles.sidebar, isMobileView ? styles.sidebarMobile : styles.sidebarDesktop]}>
								<Sidebar components={sidebar} />
							</View>
						)}

						{/* Mobile Footer */}
						{!fullPage && isMobileView && <Footer />}
					</View>
				</ScrollView>

				{/* Floating Mobile Sidebar Elements (Overlayed on Screen Root) */}
				{isMobileFullPage && sidebar && sidebar.length > 0 && (
					<>
						{isSidebarVisible && (
							<View
								style={{
									position: 'absolute',
									bottom: floatingMenuBottom,
									left: 16,
									right: 16,
									maxHeight: '60%',
									backgroundColor: '#1a1a1a',
									borderRadius: 16,
									borderWidth: 1,
									borderColor: '#333333',
									padding: 16,
									zIndex: 99,
									shadowColor: '#000',
									shadowOffset: {width: 0, height: 4},
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 10,
								}}
							>
								<ScrollView nestedScrollEnabled style={{maxHeight: '100%'}}>
									<Sidebar components={sidebar} />
								</ScrollView>
							</View>
						)}

						<Pressable
							onPress={() => setIsSidebarVisible(prev => !prev)}
							style={{
								position: 'absolute',
								bottom: floatingButtonBottom,
								right: 16,
								zIndex: 100,
								backgroundColor: '#1a1a1a',
								borderWidth: 1,
								borderColor: '#333333',
								width: 48,
								height: 48,
								borderRadius: 24,
								justifyContent: 'center',
								alignItems: 'center',
								shadowColor: '#000',
								shadowOffset: {width: 0, height: 2},
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 8,
							}}
						>
							<MaterialCommunityIcons name={isSidebarVisible ? 'close' : 'view-dashboard-outline'} size={24} color="#ffffff" />
						</Pressable>
					</>
				)}
			</View>
		</View>
	);
}
