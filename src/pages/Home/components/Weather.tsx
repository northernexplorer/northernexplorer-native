import { View, Text } from "react-native";
import { WeatherType } from "../hooks/useWeather/getWeather";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getWeatherIcon} from "~/pages/Home/lib/getWeatherIcon";
import {styles} from "~/pages/Home/lib/styles";

type WeatherProps = {
    data: WeatherType;
};

export function Weather({ data}: WeatherProps) {
    const weather = data.weather[0];

    const iconCode = weather?.icon ?? "03d";
    const iconName = getWeatherIcon(iconCode);

    return (
        <View
            style={styles.hero}
        >
            <Text style={{ color: "white", fontSize: 20, opacity: 0.8 }}>
                {data.name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8, gap: 16 }}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={64}
                    color="#fff"
                />
                <Text style={{ color: "white", fontSize: 64, fontWeight: "200" }}>
                    {Math.round(data.main.temp)}°
                </Text>
            </View>

            <Text style={{ color: "#ddd", fontSize: 16 }}>
                {weather.description}
            </Text>

            <View style={{ marginTop: 16, gap: 6 }}>
                <Text style={styles.metric}>
                    Wind {Math.round(data.wind.speed)} km/h
                </Text>
                <Text style={styles.metric}>
                    Humidity {data.main.humidity}%
                </Text>
            </View>
        </View>
    );
}