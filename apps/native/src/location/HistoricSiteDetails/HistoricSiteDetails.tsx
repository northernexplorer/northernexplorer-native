import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { styles } from '~/location/HistoricSiteDetails/styles';
import { getUrl } from '@northernexplorer/tools/dist/src';
import { config } from '~/config';
import { useApiClient } from '~/core/useApiClient';

export function HistoricSiteDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useApiClient(
    'location',
    'HistoricSiteController',
    'getHistoricSiteById',
    { id: parseInt(id) },
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0088cc" style={styles.centerSpinner} />;
  }

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
        onLoad={() => console.log('loaded')}
        onError={(e) => console.log('error', e.nativeEvent)}
      />
      <View style={styles.content}>
        <Text style={styles.breadcrumbs}>
          {data.country} › {data.region}
        </Text>

        <Text style={styles.title}>{data.name}</Text>

        <Text style={styles.coordinatesLabel}>
          Coordinates: {data.coordinates.latitude.toFixed(4)}°,{' '}
          {data.coordinates.longitude.toFixed(4)}°
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>{data.description}</Text>
      </View>
    </View>
  );
}
