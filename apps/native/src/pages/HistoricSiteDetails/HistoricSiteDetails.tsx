import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetHistoricSiteDetails } from '~/hooks/useGetHistoricSiteDetails';
import { styles } from '~/pages/HistoricSiteDetails/styles';
import { getImagePath } from '~/lib/getImagePath';

export function HistoricSiteDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { site, loading, error } = useGetHistoricSiteDetails(id);
  if (loading) {
    return <ActivityIndicator size="large" color="#0088cc" style={styles.centerSpinner} />;
  }

  if (error || !site) {
    return (
      <Text style={styles.errorText}>
        {error?.message || 'This historic location profile details could not be found.'}
      </Text>
    );
  }
  console.log('site.image =', site.image);
  return (
    <View>
      <Image
        source={{
          uri: getImagePath(site.image),
        }}
        style={styles.banner}
        onLoad={() => console.log('loaded')}
        onError={(e) => console.log('error', e.nativeEvent)}
      />
      <View style={styles.content}>
        <Text style={styles.breadcrumbs}>
          {site.country} › {site.region}
        </Text>

        <Text style={styles.title}>{site.name}</Text>

        <Text style={styles.coordinatesLabel}>
          Coordinates: {site.coordinates.latitude.toFixed(4)}°,{' '}
          {site.coordinates.longitude.toFixed(4)}°
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>{site.description}</Text>
      </View>
    </View>
  );
}
