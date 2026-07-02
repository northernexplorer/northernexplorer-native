import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Map as NativeMap,
  Camera,
  Marker,
} from '@maplibre/maplibre-react-native';
import { useLocation } from '~/state/hooks/location/useLocation';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';
import { Link } from 'expo-router';
import { getUrlSafeString } from '@northernexplorer/tools';
import { HistoricSiteType } from '@northernexplorer/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function Map() {
  const coords = useLocation();
  const { sites } = useClosestHistoricSites(coords);

  const [selectedSite, setSelectedSite] = useState<HistoricSiteType | null>(null);

  if (!coords) return null;

  return (
    <View style={{ flex: 1 }}>
      <NativeMap
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        onPress={() => {
          if (selectedSite) {
            setSelectedSite(null);
          }
        }}
      >
        <Camera zoom={10} center={[coords.lon, coords.lat]} />

        {sites?.map((site) => (
          <Marker
            key={site.id}
            lngLat={[site.coordinates.longitude, site.coordinates.latitude]}
            anchor="bottom"
            onPress={() => setSelectedSite(site)}
          >
            <MaterialCommunityIcons name="bank" size={36} color="#FFB85A" />
          </Marker>
        ))}

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
