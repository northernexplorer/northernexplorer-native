import React from "react";
import { View, Text, Image } from "react-native";

type Props = {
    name: string;
    description: string;
    image: string;
};

export function HistoricSitePreview({ name, description, image }: Props) {
    return (
        <View
            style={{
                width: 160,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.05)",
                overflow: "hidden",
                marginRight: 12,
            }}
        >
            <Image
                source={{ uri: image }}
                style={{
                    width: "100%",
                    height: 90,
                }}
                resizeMode="cover"
            />

            <View style={{ padding: 10 }}>
                <Text
                    style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: 14,
                        fontWeight: "600",
                    }}
                    numberOfLines={1}
                >
                    {name}
                </Text>

                <Text
                    style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        marginTop: 6,
                        lineHeight: 16,
                    }}
                    numberOfLines={2}
                >
                    {description}
                </Text>
            </View>
        </View>
    );
}