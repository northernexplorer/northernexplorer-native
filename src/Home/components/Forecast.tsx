import { ScrollView, Text, View } from "react-native";
import { Card } from "react-native-paper";

export function Forecast({ data, loading, error }: any) {
    if (loading) return <Text>Loading...</Text>;
    if (error || !data) return <Text>Forecast unavailable</Text>;

    const daily = Object.values(
        data.list.reduce((acc: any, entry: any) => {
            const date = entry.dt_txt.split(" ")[0];

            if (!acc[date]) acc[date] = entry;

            return acc;
        }, {}),
    ).slice(0, 5);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
        >
            {daily.map((f: any) => {
                const day = new Date(f.dt * 1000).toLocaleDateString(
                    "en-CA",
                    { weekday: "short" },
                );

                return (
                    <Card key={f.dt} style={{ width: 90 }}>
                        <Card.Content style={{ alignItems: "center" }}>
                            <Text>{day}</Text>
                            <Text>{Math.round(f.main.temp)}°</Text>
                            <Text style={{ textTransform: "capitalize" }}>
                                {f.weather[0].main}
                            </Text>
                        </Card.Content>
                    </Card>
                );
            })}
        </ScrollView>
    );
}