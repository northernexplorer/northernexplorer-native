import React from 'react';
import { View } from 'react-native';
import { Map as NativeMap, Camera } from '@maplibre/maplibre-react-native';
import { useLocation } from '~/state/hooks/location/useLocation';

export function Map() {
  const coords = useLocation();

  if (!coords) return null;

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <NativeMap
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        <Camera zoom={10} center={[coords.lon, coords.lat]} />
      </NativeMap>
    </View>
  );
}
