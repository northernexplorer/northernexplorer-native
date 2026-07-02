import { useState, useEffect } from 'react';
import { getHistoricSites } from '~/hooks/getClosestHistoricSites';
import { HistoricSiteType } from '@northernexplorer/types';

export function useClosestHistoricSites(coords: { lat: number; lon: number } | null) {
  const [sites, setSites] = useState<HistoricSiteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lat = coords?.lat;
  const lon = coords?.lon;

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getHistoricSites(lat, lon)
      .then((data) => {
        if (isMounted) {
          setSites(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load historic sites:', err);
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lon]);

  return { sites, loading, error };
}
