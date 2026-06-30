import React, { useState } from 'react';
import MapGL, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocation } from '~/state/hooks/location/useLocation';
import { useClosestHistoricSites } from '~/hooks/useClosestHistoricSites';
import { Link } from 'expo-router';
import { getUrlSafeString } from '~/lib/getUrlSafeString';

interface SelectedSite {
  longitude: number;
  latitude: number;
  name: string;
  description: string;
}

export function Map() {
  const coords = useLocation();
  const { sites } = useClosestHistoricSites(coords);

  const [selectedSite, setSelectedSite] = useState<SelectedSite | null>(null);

  if (!coords) return null;

  const geoJsonFeatures = {
    type: 'FeatureCollection' as const,
    features: (sites || []).map((site) => ({
      type: 'Feature' as const,
      id: site.id,
      properties: {
        name: site.name,
        description: site.description || 'No description available.', // Assuming your data has a description
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [site.coordinates.longitude, site.coordinates.latitude],
      },
    })),
  };

  const onMapClick = (event: any) => {
    const feature = event.features && event.features[0];

    if (feature) {
      const [longitude, latitude] = feature.geometry.coordinates;
      setSelectedSite({
        longitude,
        latitude,
        name: feature.properties.name,
        description: feature.properties.description,
      });
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', minHeight: '400px' }}>
      <MapGL
        mapLib={maplibregl}
        initialViewState={{
          longitude: coords.lon,
          latitude: coords.lat,
          zoom: 10,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        onClick={onMapClick}
        interactiveLayerIds={['historicSitesLayer']}
        cursor={selectedSite ? 'pointer' : 'default'}
      >
        {sites && sites.length > 0 && (
          <Source id="historicSitesSource" type="geojson" data={geoJsonFeatures}>
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
          </Source>
        )}

        {selectedSite && (
          <Popup
            longitude={selectedSite.longitude}
            latitude={selectedSite.latitude}
            anchor="bottom"
            onClose={() => setSelectedSite(null)}
            closeOnClick={false}
          >
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
              <h3
                style={{
                  margin: '0 0 5px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {selectedSite.name}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.4',
                }}
              >
                {selectedSite.description}
              </p>
            </Link>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
