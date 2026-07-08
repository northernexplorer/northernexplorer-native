import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/core/storeHooks';
import { setCity, setCityLoading, setCityError } from '~/location/state/city/citySlice';
import { useApiFetch } from '~/core/useApiFetch';

export function useCityBootstrap() {
    const dispatch = useAppDispatch();
    const coords = useAppSelector((s) => s.location.data);

    const { data, loading, error } = useApiFetch(
        'location',
        'CityController',
        'getCityData',
        coords ? { lat: coords.lat, lon: coords.lon } : null,
    );

    useEffect(() => {
        dispatch(setCityLoading(loading));
    }, [dispatch, loading]);

    useEffect(() => {
        if (error) {
            dispatch(setCityError('Failed to resolve city'));
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (data) {
            dispatch(setCity(data));
        }
    }, [dispatch, data]);
}
