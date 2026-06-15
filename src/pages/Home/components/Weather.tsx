import { View, Text } from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getWeatherIcon} from "~/pages/Home/lib/getWeatherIcon";
import {styles} from "~/pages/Home/lib/styles";
import {WeatherType} from "~/state/hooks/weather/getWeather";

type WeatherProps = {
    data: WeatherType;
};

export function Weather({ data }: WeatherProps) {
    const current = data.current;
    const condition = current?.condition;

    const iconCode = String(condition?.code ?? 1000);
    const iconName = getWeatherIcon(iconCode);

    return (
        <View style={styles.hero}>
            <Text style={{ color: "white", fontSize: 20, opacity: 0.8 }}>
                {data.location.name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8, gap: 16 }}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={64}
                    color="#fff"
                />
                <Text style={{ color: "white", fontSize: 64, fontWeight: "200" }}>
                    {Math.round(current.temp_c)}°
                </Text>
            </View>

            <Text style={{ color: "#ddd", fontSize: 16 }}>
                {condition?.text}
            </Text>

            <View style={{ marginTop: 16, gap: 6 }}>
                <Text style={styles.metric}>
                    Wind {Math.round(current.wind_kph)} km/h
                </Text>
                <Text style={styles.metric}>
                    Humidity {current.humidity}%
                </Text>
            </View>
        </View>
    );
}