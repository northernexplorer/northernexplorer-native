import { useApiClient } from '~/core/useApiClient';
import { useAppSelector } from '~/core/storeHooks';
import { useSyncToRedux } from '~/core/useSyncToRedux';
import {
    setFieldNote,
    setFieldNoteError,
    setFieldNoteLoading,
} from '~/environment/state/fieldNote/fieldNoteSlice';

export function useFieldNoteBootstrap() {
    const coords = useAppSelector((s) => s.location.data);
    const { data, lastUpdated } = useAppSelector((s) => s.fieldNote);

    const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 60;
    const shouldFetch = !!coords && (!data || isStale);

    const {
        data: fetchedData,
        loading,
        error,
    } = useApiClient(
        'environment',
        'FieldNoteController',
        'getFieldNoteData',
        shouldFetch ? { lat: coords!.lat, lon: coords!.lon } : null,
    );

    useSyncToRedux(fetchedData, loading, error, {
        set: setFieldNote,
        setLoading: setFieldNoteLoading,
        setError: setFieldNoteError,
    });
}
