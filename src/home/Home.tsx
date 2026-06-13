import {ImageBackground, View, ScrollView, useWindowDimensions, ActivityIndicator} from "react-native";
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
    const isMobileView = width < 1000;

    const isReady =
        coords &&
        weather &&
        forecast &&
        lunar &&
        quote;

    if (!isReady) {
        return (
            <ImageBackground
                source={theme?.image ? { uri: theme.image } : undefined}
                style={styles.background}
            >
                <View style={styles.darkOverlay} />
                <View style={styles.vignette} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </ImageBackground>
        );
    }

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
                                <View style={styles.weatherSection}>
                                    <Weather data={weather} />
                                </View>
                                <View style={styles.mobileLunarSection}>
                                    <Lunar data={lunar} />
                                </View>
                            </View>
                            <View style={styles.mobileQuoteSection}>
                                <Quote data={quote} />
                            </View>
                        </>
                    ) : (
                        <View style={styles.heroRow}>
                            <View style={styles.weatherSection}>
                                <Weather data={weather} />
                            </View>
                            <View style={styles.quoteSection}>
                                <Quote data={quote} />
                            </View>
                            <View style={styles.lunarSection}>
                                <Lunar data={lunar} />
                            </View>
                        </View>
                    )}
                    <View style={styles.forecastSection}>
                        <Forecast data={forecast} />
                    </View>
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