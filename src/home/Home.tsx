import { ImageBackground, View, ScrollView, useWindowDimensions } from "react-native";
import { styles } from "../lib/styles";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { useLocation } from "./hooks/useLocation";
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";
import { getWeatherTheme } from "../lib/getWeatherTheme";
import { Sidebar } from "./components/Sidebar";
import {Lunar} from "~/home/components/Lunar";
import {useLunarCycle} from "~/home/hooks/useLunarCycle";
import {Quote} from "~/home/components/Quote";
import {useQuote} from "~/home/hooks/useQuote";

export function Home() {
    const coords = useLocation();
    const weather = useWeather(coords?.lat, coords?.lon);
    const forecast = useForecast(coords?.lat, coords?.lon);
    const theme = weather ? getWeatherTheme(weather.weather[0].main) : null;
    const lunar = useLunarCycle();
    const quote = useQuote();

    const { width } = useWindowDimensions();
    const isMobileView = width < 768;

    // Use ScrollView on mobile screens to allow scrolling down to the sidebar
    const Container = isMobileView ? ScrollView : View;

    return (
        <ImageBackground
            source={{ uri: theme?.image }}
            style={styles.background}
        >
            <View style={styles.darkOverlay} />
            <View style={styles.vignette} />

            <Container
                style={[
                    styles.page,
                    { flexDirection: isMobileView ? "column" : "row" }
                ]}
            >
                <View
                    style={[
                        styles.main,
                    ]}
                >
                    {isMobileView ? (
                        <>
                            <View style={styles.mobileHeroRow}>
                                {weather && (
                                    <View style={styles.weatherSection}>
                                        <Weather data={weather} />
                                    </View>
                                )}

                                {lunar && (
                                    <View style={styles.mobileLunarSection}>
                                        <Lunar data={lunar} />
                                    </View>
                                )}
                            </View>

                            {quote && (
                                <View style={styles.mobileQuoteSection}>
                                    <Quote data={quote} />
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.heroRow}>
                            {weather && (
                                <View style={styles.weatherSection}>
                                    <Weather data={weather} />
                                </View>
                            )}

                            {quote && (
                                <View style={styles.quoteSection}>
                                    <Quote data={quote} />
                                </View>
                            )}

                            {lunar && (
                                <View style={styles.lunarSection}>
                                    <Lunar data={lunar} />
                                </View>
                            )}
                        </View>
                    )}
                    {forecast && (
                        <View style={styles.forecastSection}>
                            <Forecast data={forecast} />
                        </View>
                    )}
                </View>

                <View
                    style={[
                        styles.sidebar,
                    ]}
                >
                    <Sidebar coords={coords} />
                </View>
            </Container>
        </ImageBackground>
    );
}