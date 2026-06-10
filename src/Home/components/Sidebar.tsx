import {View, Text} from "react-native";

type SidebarProps = {
    coords: {
        lat: number;
        lon: number;
    } | null;
};

export function Sidebar({ coords }: SidebarProps) {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 16 }}>
                </Text>
            </View>

            {/* Bottom pinned coords */}
            <View
                style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.1)",
                }}
            >
                <Text style={{ color: "rgba(255,255,255,0.5)" }}>
                    Latitude: {coords?.lat?.toFixed(4) ?? "--"}
                </Text>

                <Text style={{ color: "rgba(255,255,255,0.5)" }}>
                    Longitude: {coords?.lon?.toFixed(4) ?? "--"}
                </Text>
            </View>
        </View>
    );
}