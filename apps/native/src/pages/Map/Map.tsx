import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Map as NativeMap,
  Camera,
  GeoJSONSource,
  Layer,
  Marker,
} from '@maplibre/maplibre-react-native';
import { useLocation } from '~/state/hooks/location/useLocation';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';
import { getUrlSafeString } from '~/lib/getUrlSafeString';
import { Link } from 'expo-router';

export function Map() {
  const coords = useLocation();
  const { sites } = useClosestHistoricSites(coords);

  // State to track the active selected site details
  const [selectedSite, setSelectedSite] = useState<HistoricSite | null>(null);

  if (!coords) return null;

  const geoJsonFeatures = {
    type: 'FeatureCollection' as const,
    features: (sites || []).map((site) => ({
      type: 'Feature' as const,
      id: site.id,
      properties: {
        name: site.name,
        // Make sure to forward the description into properties
        description: site.description || 'No description available.',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [site.coordinates.longitude, site.coordinates.latitude],
      },
    })),
  };

  const onSourcePress = (event: any) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    const features = event.features || event.nativeEvent?.features;
    const feature = features?.[0];

    if (feature) {
      setSelectedSite({
        coordinates: feature.geometry.coordinates,
        name: feature.properties.name,
        description: feature.properties.description,
      });
    }
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <NativeMap
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        onPress={() => setSelectedSite(null)}
      >
        <Camera zoom={10} center={[coords.lon, coords.lat]} />

        {sites && sites.length > 0 && (
          <GeoJSONSource id="historicSitesSource" data={geoJsonFeatures} onPress={onSourcePress}>
            <Layer
              id="historicSitesLayer"
              type="circle"
              paint={{
                'circle-radius': 8,
                'circle-color': '#FFB85AFF',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </GeoJSONSource>
        )}

        {selectedSite && (
          <Marker lngLat={selectedSite.coordinates} anchor={'bottom'}>
            <Link
              href={{
                pathname: '/[country]/[region]/[name]/[id]',
                params: {
                  country: getUrlSafeString(selectedSite.country),
                  region: getUrlSafeString(selectedSite.region),
                  id: getUrlSafeString(selectedSite.id),
                  name: getUrlSafeString(selectedSite.name),
                },
              }}
            >
              <Text style={styles.popupTitle}>{selectedSite.name}</Text>
              <Text style={styles.popupDescription}>{selectedSite.description}</Text>
              <View style={styles.popupArrow} />
            </Link>
          </Marker>
        )}
      </NativeMap>
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 220,
    alignItems: 'center',
    position: 'relative',
  },
  popupTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  popupDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  popupArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
});
