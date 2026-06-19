import React from "react";
import {View, Text, Image, Pressable} from "react-native";
import {Link} from "expo-router";
import {getImagePath} from "~/lib/getImagePath";
import {getUrlSafeString} from "~/lib/getUrlSafeString";
import {styles} from "~/pages/Home/styles";

type Props = {
    id: number;
    name: string;
    description: string;
    image: string;
    country: string;
    region: string;
};

export function HistoricSitePreview({ id, name, description, image, country, region }: Props) {
    return (
        <Link
            href={{
                pathname: "/[country]/[region]/[name]/[id]",
                params: { country: getUrlSafeString(country), region: getUrlSafeString(region), id: getUrlSafeString(id), name: getUrlSafeString(name)}
            }}
            asChild
        >
            <Pressable>
                <View style={[styles.tile, {width: 160}]}>
                    <Image
                        source={{ uri: getImagePath(image) }}
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
            </Pressable>
        </Link>
    );
}