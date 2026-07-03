import { useState, useEffect } from 'react';
import { HistoricSiteType } from '@northernexplorer/types';
import { apiClient } from '~/hooks/apiClient';

export function useGetHistoricSiteDetails(id: number) {
  const [site, setSite] = useState<HistoricSiteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    apiClient('location', 'HistoricSiteController', 'getHistoricSiteById', { id })
      .then((data) => {
        if (isMounted) {
          setSite(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(`Failed to load historic site detail record for ID ${id}:`, err);
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
  }, [id]);

  return { site, loading, error };
}
