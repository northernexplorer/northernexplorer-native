import { View, Text } from "react-native";
import { useCity } from "~/state/hooks/useCity";
import {useLocation} from "~/state/hooks/useLocation";

export function HomeSidebar() {
    const coords = useLocation();
    const locationName = useCity();

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 16 }}>
                    {/* Placeholder for future menu links or content */}
                </Text>
            </View>

            <View
                style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.1)",
                    gap: 4, // Clean vertical rhythm spacing
                }}
            >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                    {locationName ?? (coords ? "Locating..." : "No location selected")}
                </Text>

                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    {coords?.lat?.toFixed(4) ?? "--"}, {coords?.lon?.toFixed(4) ?? "--"}
                </Text>
            </View>
        </View>
    );
}