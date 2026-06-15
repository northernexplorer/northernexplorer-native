import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { styles } from "~/home/lib/styles";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { Lunar } from "./components/Lunar";
import { Quote } from "./components/Quote";

import { useLocation } from "./hooks/useLocation";
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";
import { useLunarCycle } from "./hooks/useLunarCycle";
import { useQuote } from "./hooks/useQuote";

export function Home() {
    const coords = useLocation();
    const weather = useWeather(coords?.lat, coords?.lon);
    const forecast = useForecast(coords?.lat, coords?.lon);
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <>
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
        </>
    );
}