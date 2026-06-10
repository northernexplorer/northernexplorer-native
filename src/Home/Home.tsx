import { View } from "react-native";
import { Text, Card } from "react-native-paper";

export function Home() {
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Card>
                <Card.Content>
                    <Text variant="headlineLarge" style={{ textAlign: "center" }}>
                        Northern Explorer
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={{ textAlign: "center", marginTop: 10 }}
                    >
                        Discover nature, wildlife, and remote places.
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
}