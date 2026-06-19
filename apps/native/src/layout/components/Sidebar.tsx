import { View, Text } from "react-native";
import { useCity } from "~/state/hooks/city/useCity";
import {useLocation} from "~/state/hooks/location/useLocation";
import {ComponentType} from "react";

interface Props {
    components?: ComponentType[]
}

export function Sidebar({components}: Props) {
    const coords = useLocation();
    const city = useCity();

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 16 }}>
                    {components?.map((Component, index) => <Component key={index} />)}
                </Text>
            </View>

            <View
                style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.1)",
                    gap: 4,
                }}
            >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                    {city?.name}, {city?.country}
                </Text>

                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    {coords?.lat?.toFixed(4) ?? "--"}, {coords?.lon?.toFixed(4) ?? "--"}
                </Text>
            </View>
        </View>
    );
}