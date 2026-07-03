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

    const fetchSiteDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient('location', 'HistoricSiteController', 'getHistoricSiteById', {
          id,
        });

        if (isMounted) {
          setSite(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Failed to load historic site detail record for ID ${id}:`, err);
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSiteDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { site, loading, error };
}
