import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Map as NativeMap, Camera, Marker } from '@maplibre/maplibre-react-native';
import { useLocation } from '~/state/hooks/location/useLocation';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';
import { Link } from 'expo-router';
import { getUrl, getUrlSafeString } from '@northernexplorer/tools';
import { HistoricSiteType } from '@northernexplorer/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { config } from '~/config';

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
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="bank" size={36} color="#1e1e1e" cursor="pointer" />
            </View>
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
                {selectedSite.image && (
                  <Image
                    source={{
                      uri: getUrl({ path: selectedSite.image, serverUrl: config.SERVER_URL }),
                    }}
                    style={styles.popupImage}
                  />
                )}

                <View style={styles.popupContent}>
                  <Text style={styles.popupTitle}>{selectedSite.name}</Text>
                  <Text style={styles.popupDescription}>{selectedSite.description}</Text>
                </View>
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
    backgroundColor: '#fff',
    padding: 12,
    maxWidth: 220,
    position: 'relative',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
    textAlign: 'left',
    marginTop: 8,
  },
  popupDescription: {
    margin: 0,
    fontSize: 12,
    color: '#666',
  },
  popupArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
  popupImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  popupContent: {
    flexDirection: 'column',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
