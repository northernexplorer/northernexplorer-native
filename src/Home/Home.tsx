import { ImageBackground, View } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../lib/styles";
import { Weather } from "./components/Weather";
import { Forecast } from "./components/Forecast";
import { useWeather } from "./hooks/useWeather";
import { useForecast } from "./hooks/useForecast";

export function Home() {
    const weather = useWeather();
    const forecast = useForecast();

    return (
        <ImageBackground
            source={{
                uri: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31",
            }}
            style={styles.background}
        >
            <View style={styles.overlay} />

            <View style={styles.container}>
                <Text style={styles.brand}>Northern Explorer</Text>

                <View style={styles.grid}>
                    <Weather {...weather} />
                    <Forecast {...forecast} />
                </View>
            </View>
        </ImageBackground>
    );
}