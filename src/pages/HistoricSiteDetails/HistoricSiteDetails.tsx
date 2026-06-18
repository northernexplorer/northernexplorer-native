import React from "react";
import { View, Text, Image, ActivityIndicator} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetHistoricSiteDetails } from "~/hooks/useGetHistoricSiteDetails";
import {styles} from "~/pages/HistoricSiteDetails/styles";

export function HistoricSiteDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { site, loading, error } = useGetHistoricSiteDetails(id);

    if (loading) {
        return <ActivityIndicator size="large" color="#0088cc" style={styles.centerSpinner} />;
    }

    if (error || !site) {
        return (
            <Text style={styles.errorText}>
                {error?.message || "This historic location profile details could not be found."}
            </Text>
        );
    }

    return (
        <>
            {site.image && (
                <Image source={{ uri: site.image }} style={styles.banner} resizeMode="cover" />
            )}

            <View style={styles.content}>
                <Text style={styles.breadcrumbs}>
                    {site.country} › {site.region}
                </Text>

                <Text style={styles.title}>{site.name}</Text>

                <Text style={styles.coordinatesLabel}>
                    Coordinates: {site.coordinates.latitude.toFixed(4)}°, {site.coordinates.longitude.toFixed(4)}°
                </Text>

                <View style={styles.divider} />

                <Text style={styles.body}>{site.description}</Text>
            </View>
        </>
    );
}