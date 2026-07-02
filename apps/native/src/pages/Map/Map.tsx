import React, { useState } from 'react';
import { View, Text, StyleSheet, NativeSyntheticEvent } from 'react-native';
import {
  Map as NativeMap,
  Camera,
  GeoJSONSource,
  Layer,
  Marker,
  PressEventWithFeatures,
} from '@maplibre/maplibre-react-native';
import { useLocation } from '~/state/hooks/location/useLocation';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';
import { Link } from 'expo-router';
import { getUrlSafeString } from '@northernexplorer/tools/dist/src';
import { HistoricSiteType } from '@northernexplorer/types';
import { FeatureCollection, Point } from 'geojson';

export function Map() {
  const coords = useLocation();
  const { sites } = useClosestHistoricSites(coords);

  const [selectedSite, setSelectedSite] = useState<HistoricSiteType | null>(null);

  if (!coords) return null;

  const geoJsonFeatures: FeatureCollection<Point, HistoricSiteType> = {
    type: 'FeatureCollection',
    features: (sites || []).map((site) => ({
      type: 'Feature',
      id: site.id,
      properties: site,
      geometry: {
        type: 'Point',
        coordinates: [site.coordinates.longitude, site.coordinates.latitude],
      },
    })),
  };

  const onSourcePress = (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
    const feature = event.nativeEvent.features?.[0];

    if (feature && feature.geometry.type === 'Point') {
      let props = feature.properties as HistoricSiteType;
      const [longitude, latitude] = (feature.geometry as Point).coordinates;

      setSelectedSite({
        ...props,
        coordinates: {
          longitude,
          latitude,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NativeMap
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        <Camera zoom={10} center={[coords.lon, coords.lat]} />

        {sites && sites.length > 0 && (
          <GeoJSONSource id="historicSitesSource" data={geoJsonFeatures} onPress={onSourcePress}>
            <Layer
              id="historicSitesLayer"
              type="circle"
              paint={{
                'circle-radius': 8,
                'circle-color': '#FFB85A',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </GeoJSONSource>
        )}

        {selectedSite && (
          <Marker
            lngLat={[selectedSite.coordinates.longitude, selectedSite.coordinates.latitude]}
            anchor={'bottom'}
          >
            <View style={styles.popupContainer}>
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
              </Link>
              <View style={styles.popupArrow} />
            </View>
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
