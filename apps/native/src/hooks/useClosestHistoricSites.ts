import { useState, useEffect } from 'react';
import { getHistoricSites } from '~/hooks/getClosestHistoricSites';
import { HistoricSiteType } from '@northernexplorer/types';

export function useClosestHistoricSites(coords: { lat: number; lon: number } | null) {
  const [sites, setSites] = useState<HistoricSiteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coords) return;
    const { lat, lon } = coords;

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
  }, [coords]);

  return { sites, loading, error };
}
