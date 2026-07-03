import { useState, useEffect } from 'react';
import { HistoricSiteType } from '@northernexplorer/types';
import { apiClient } from '~/hooks/apiClient';

export function useClosestHistoricSites(coords: { lat: number; lon: number } | null) {
  const [sites, setSites] = useState<HistoricSiteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lat = coords?.lat;
  const lon = coords?.lon;

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient(
          'location',
          'HistoricSiteController',
          'getNearbyHistoricSites',
          {
            lat,
            lon,
          },
        );

        if (isMounted) {
          setSites(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load historic sites:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [lat, lon]);

  return { sites, loading, error };
}
