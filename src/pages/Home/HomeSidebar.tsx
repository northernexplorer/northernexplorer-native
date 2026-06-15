import { View, Text } from "react-native";
import { useCity } from "./hooks/useCity";
import {useLocation} from "~/pages/Home/hooks/useLocation";

export function HomeSidebar() {
    const coords = useLocation();
    const locationName = useCity(coords?.lat, coords?.lon);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* Top Main Content */}
            <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 16 }}>
                    {/* Placeholder for future menu links or content */}
                </Text>
            </View>

            {/* Bottom pinned metadata container */}
            <View
                style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.1)",
                    gap: 4, // Clean vertical rhythm spacing
                }}
            >
                {/* Dynamically display the resolved City, State/Country */}
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                    {locationName ?? (coords ? "Locating..." : "No location selected")}
                </Text>

                {/* Raw Coordinates Readout */}
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    {coords?.lat?.toFixed(4) ?? "--"}, {coords?.lon?.toFixed(4) ?? "--"}
                </Text>
            </View>
        </View>
    );
}