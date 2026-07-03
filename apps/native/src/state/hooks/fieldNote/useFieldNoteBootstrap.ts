import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/state/storeHooks';
import {
  setFieldNote,
  setFieldNoteLoading,
  setFieldNoteError,
} from '~/state/slices/fieldNoteSlice';
import { apiClient } from '~/hooks/apiClient';

const STALE_TIME = 1000 * 60 * 60; // 1 hour

export function useFieldNoteBootstrap() {
  const dispatch = useAppDispatch();

  const { data, lastUpdated } = useAppSelector((s) => s.fieldNote);
  const coords = useAppSelector((s) => s.location.data);

  useEffect(() => {
    if (!coords) return;

    const isStale = !lastUpdated || Date.now() - lastUpdated > STALE_TIME;

    if (data && !isStale) return;

    let cancelled = false;

    const { lat, lon } = coords;

    async function run() {
      try {
        dispatch(setFieldNoteLoading(true));

        const result = await apiClient('environment', 'FieldNoteController', 'getFieldNoteData', {
          lat,
          lon,
        });

        if (cancelled) return;

        dispatch(setFieldNote(result));
      } catch {
        if (!cancelled) {
          dispatch(setFieldNoteError('Failed to fetch field note'));
        }
      } finally {
        if (!cancelled) {
          dispatch(setFieldNoteLoading(false));
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [coords, lastUpdated, dispatch]);
}
