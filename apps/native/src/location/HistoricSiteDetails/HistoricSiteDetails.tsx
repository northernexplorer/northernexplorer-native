import React from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { styles } from '~/location/HistoricSiteDetails/styles';
import { getUrl } from '@northernexplorer/tools';
import { config } from '~/config';
import { useApiFetch } from '~/core/useApiFetch';
import { Spinner } from '~/layout/Layout/components/Spiner';

export function HistoricSiteDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, loading, error } = useApiFetch(
        'location',
        'HistoricSiteController',
        'getHistoricSiteById',
        { id: parseInt(id) },
    );
    if (loading) return <Spinner />;

    if (error || !data) {
        return (
            <Text style={styles.errorText}>
                {error?.message || 'This historic location profile details could not be found.'}
            </Text>
        );
    }

    return (
        <View>
            <Image
                source={{ uri: getUrl({ path: data.image, serverUrl: config.SERVER_URL }) }}
                style={styles.banner}
            />
            <View style={styles.content}>
                <Text style={styles.breadcrumbs}>
                    {data.country} › {data.region}
                </Text>

                <Text style={styles.title}>{data.name}</Text>

                <View style={styles.metaContainer}>
                    <Text style={styles.metaLabel}>
                        Coordinates: {data.lat.toFixed(4)}°, {data.lon.toFixed(4)}°
                    </Text>
                    <Text style={styles.metaLabel}>
                        Dates: {data.startDate || 'Unknown'} - {data.endDate || 'Unknown'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.body}>{data.description}</Text>
            </View>
        </View>
    );
}
