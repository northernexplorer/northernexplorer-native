import React, { useState } from 'react';
import MapGL, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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

  // Typing the click event with MapLayerMouseEvent from react-map-gl
  const onMapClick = (event: FeatureCollection<Point, HistoricSiteType>) => {
    const feature = event.features?.[0];

    if (feature && feature.geometry.type === 'Point') {
      const props = feature.properties;
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
              type="symbol"
              layout={{
                'icon-image': 'castle',
                'icon-size': 1.2,
                'icon-allow-overlap': true,
              }}
            />
          </Source>
        )}

        {selectedSite && (
          <Popup
            longitude={selectedSite.coordinates.longitude}
            latitude={selectedSite.coordinates.latitude}
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
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                {selectedSite.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                {selectedSite.description}
              </p>
            </Link>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
