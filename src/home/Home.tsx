import { ImageBackground, View, Text, ScrollView, useWindowDimensions } from "react-native";
import { styles } from "../lib/styles";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { useLocation } from "./hooks/useLocation";
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";
import { getWeatherTheme } from "../lib/getWeatherTheme";
import { Sidebar } from "./components/Sidebar";

export function Home() {
    const coords = useLocation();
    const weather = useWeather(coords?.lat, coords?.lon);
    const forecast = useForecast(coords?.lat, coords?.lon);
    const theme = weather ? getWeatherTheme(weather.weather[0].main) : null;

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
                    {weather && (
                        <View style={styles.heroSection}>
                            <Weather data={weather} />
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