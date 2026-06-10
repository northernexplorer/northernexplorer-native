import { View, Text } from "react-native";
import { WeatherType } from "../hooks/useWeather/getWeather";
import {styles} from "../../lib/styles";

type WeatherProps = {
    data: WeatherType;
};

export function Weather({ data}: WeatherProps) {
    const weather = data.weather[0];

    return (
        <View
            style={styles.hero}
        >
            <Text style={{ color: "white", fontSize: 20, opacity: 0.8 }}>
                {data.name}
            </Text>

            <Text style={{ color: "white", fontSize: 64, fontWeight: "200" }}>
                {Math.round(data.main.temp)}°
            </Text>

            <Text style={{ color: "#ddd", fontSize: 16 }}>
                {weather.description}
            </Text>

            <View style={{ marginTop: 16, gap: 6 }}>
                <Text style={{ color: "#aaa" }}>
                    Wind {Math.round(data.wind.speed)} km/h
                </Text>
                <Text style={{ color: "#aaa" }}>
                    Humidity {data.main.humidity}%
                </Text>
            </View>
        </View>
    );
}