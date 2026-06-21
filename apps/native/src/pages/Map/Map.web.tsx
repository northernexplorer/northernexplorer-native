import MapGL from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocation } from '~/state/hooks/location/useLocation';

export function Map() {
  const coords = useLocation();

  if (!coords) return null;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapGL
        mapLib={maplibregl}
        initialViewState={{
          longitude: coords.lon,
          latitude: coords.lat,
          zoom: 10,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      ></MapGL>
    </div>
  );
}
