import React, { useState } from 'react';
import MapGL, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocation } from '~/location/state/location/useLocation';
import { Link } from 'expo-router';
import { getUrl, getUrlSafeString } from '@northernexplorer/tools';
import { HistoricSiteType } from '@northernexplorer/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { config } from '~/config';
import { useApiClient } from '~/core/useApiClient';

export function Map() {
    const coords = useLocation();
    const { data } = useApiClient(
        'location',
        'HistoricSiteController',
        'getNearbyHistoricSites',
        coords,
    );

    const [selectedSite, setSelectedSite] = useState<HistoricSiteType | null>(null);

    if (!coords) return null;

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <MapGL
                mapLib={maplibregl}
                initialViewState={{
                    longitude: coords.lon,
                    latitude: coords.lat,
                    zoom: 10,
                }}
                mapStyle="https://tiles.openfreemap.org/styles/bright"
                onClick={() => setSelectedSite(null)}
                interactiveLayerIds={['historicSitesLayer']}
                cursor={selectedSite ? 'pointer' : 'default'}
            >
                {data?.map((site) => (
                    <Marker
                        key={site.id}
                        longitude={site.lon}
                        latitude={site.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation(); // Prevent map click
                            setSelectedSite(site);
                        }}
                    >
                        <div style={styles.iconCircle}>
                            <MaterialCommunityIcons
                                name="bank"
                                size={36}
                                color="#1e1e1e"
                                cursor="pointer"
                            />
                        </div>
                    </Marker>
                ))}

                {selectedSite && (
                    <Marker
                        longitude={selectedSite.lon}
                        latitude={selectedSite.lat}
                        anchor="bottom"
                    >
                        <div style={styles.popupContainer}>
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
                                    <img
                                        alt={selectedSite.name}
                                        src={getUrl({
                                            path: selectedSite.image,
                                            serverUrl: config.SERVER_URL,
                                        })}
                                        style={{
                                            width: '100%',
                                            height: 120,
                                            objectFit: 'cover',
                                            marginBottom: 8,
                                        }}
                                    />
                                )}

                                <h3 style={styles.popupTitle}>{selectedSite.name}</h3>
                                <p style={styles.popupDescription}>{selectedSite.description}</p>
                            </Link>

                            <div style={styles.popupArrow} />
                        </div>
                    </Marker>
                )}
            </MapGL>
        </div>
    );
}

const styles = {
    popupContainer: {
        background: '#fff',
        padding: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        maxWidth: 220,
        textAlign: 'center' as const,
        position: 'relative' as const,
        cursor: 'pointer',
    },
    popupTitle: {
        margin: '0 0 4px',
        fontSize: 14,
        fontWeight: 700,
        color: '#333',
    },
    popupDescription: {
        margin: 0,
        fontSize: 12,
        color: '#666',
    },
    popupArrow: {
        position: 'absolute' as const,
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid white',
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        cursor: 'pointer',
    },
};
