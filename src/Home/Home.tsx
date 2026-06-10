import { ImageBackground, View, Text } from "react-native";
import { styles } from "../lib/styles";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { useLocation } from "./hooks/useLocation";
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";
import {getWeatherTheme} from "./lib/getWeatherTheme";

export function Home() {
    const coords = useLocation();

    const weather = useWeather(coords?.lat, coords?.lon);
    const forecast = useForecast(coords?.lat, coords?.lon);

    const theme = weather ? getWeatherTheme(weather.weather[0].main) : null;

    return (
        <ImageBackground
            source={{
                uri: theme?.image,
            }}
            style={styles.background}
        >
            <View style={styles.darkOverlay} />
            <View style={styles.vignette} />

            <View style={styles.container}>
                <Text style={styles.brand}>Northern Explorer</Text>

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
        </ImageBackground>
    );
}