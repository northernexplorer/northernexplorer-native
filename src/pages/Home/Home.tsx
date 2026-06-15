import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { Lunar } from "./components/Lunar";
import { Quote } from "./components/Quote";

import { useWeather } from "~/state/hooks/useWeather";
import { useForecast } from "~/state/hooks/useForecast";
import { useLunar } from "~/state/hooks/useLunar";
import { useQuote } from "~/state/hooks/useQuote";
import {styles} from "~/pages/Home/lib/styles";

export function Home() {
    const weather = useWeather();
    const forecast = useForecast();
    const lunar = useLunar();
    const quote = useQuote();
    const { width } = useWindowDimensions();
    const isMobileView = width < 1000;

    const isReady =
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