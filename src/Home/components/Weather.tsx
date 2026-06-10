import { View, Text, Image, ActivityIndicator } from "react-native";

export function Weather({ data, loading, error }: any) {
    if (loading) {
        return <ActivityIndicator />;
    }

    if (error || !data) {
        return <Text>Unable to load weather</Text>;
    }

    const weather = data.weather[0];

    return (
        <View
            style={{
                padding: 20,
                borderRadius: 16,
                backgroundColor: "#111",
                alignItems: "center",
                gap: 8,
                flex: 1,
            }}
        >
            <Text style={{ color: "white", fontSize: 18 }}>
                {data.name}
            </Text>

            <Image
                source={{
                    uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                }}
                style={{ width: 80, height: 80 }}
            />

            <Text style={{ color: "white", fontSize: 42 }}>
                {Math.round(data.main.temp)}°
            </Text>

            <Text style={{ color: "#ccc" }}>
                {weather.description}
            </Text>

            <Text style={{ color: "#aaa" }}>
                Feels like {Math.round(data.main.feels_like)}°
            </Text>

            <Text style={{ color: "#888" }}>
                Wind {Math.round(data.wind.speed)} km/h
            </Text>
        </View>
    );
}