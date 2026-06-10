import {Animated, Text, View} from "react-native";
import {ForecastEntry, ForecastType} from "../hooks/useForecast/getForecast";
import ScrollView = Animated.ScrollView;
import {styles} from "../../lib/styles";
import {getWeatherIcon} from "../../lib/getWeatherIcon";
import {MaterialCommunityIcons} from "@expo/vector-icons";

type ForecastProps = {
    data: ForecastType;
};

export function Forecast({ data }: ForecastProps) {
    const daily = Object.values(
        data.list.reduce((acc: Record<string, ForecastEntry>, entry: ForecastEntry) => {
            const date = entry.dt_txt.split(" ")[0];

            if (!acc[date]) {
                acc[date] = entry;
            }

            return acc;
        }, {} as Record<string, ForecastEntry>),
    ).slice(0, 5);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {daily.map((f) => {
                const iconCode = f.weather?.[0]?.icon ?? "03d";
                const iconName = getWeatherIcon(iconCode);

                return (
                    <View key={f.dt} style={styles.hourTile}>
                        <Text style={styles.hourDay}>
                            {new Date(f.dt * 1000).toLocaleDateString("en-CA", {
                                weekday: "short",
                            })}
                        </Text>

                        <MaterialCommunityIcons
                            name={iconName}
                            size={28}
                            color="#fff"
                            style={{ marginVertical: 8 }}
                        />

                        <Text style={styles.hourTemp}>
                            {Math.round(f.main.temp)}°
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}