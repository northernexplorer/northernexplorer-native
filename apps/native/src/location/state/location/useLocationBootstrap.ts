import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAppSelector } from '~/core/storeHooks';
import {
    setLocation,
    setLocationError,
    setLocationLoading,
} from '~/location/state/location/locationSlice';
import {
    Accuracy,
    getForegroundPermissionsAsync,
    requestForegroundPermissionsAsync,
    getLastKnownPositionAsync,
    getCurrentPositionAsync,
} from 'expo-location';
import { useSyncToRedux } from '~/core/useSyncToRedux';

export function useLocationBootstrap() {
    const coords = useAppSelector((s) => s.location.data);

    const [data, setData] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (coords) return;

        let cancelled = false;

        const resolve = async () => {
            setLoading(true);
            setError(null);

            try {
                // --- Core Location Logic ---
                const permissions = await getForegroundPermissionsAsync();
                let granted = permissions.granted;
                if (!granted && permissions.canAskAgain) {
                    const requested = await requestForegroundPermissionsAsync();
                    granted = requested.granted;
                }

                if (granted) {
                    const cached = await getLastKnownPositionAsync();
                    if (cached) {
                        if (!cancelled)
                            setData({ lat: cached.coords.latitude, lon: cached.coords.longitude });
                        return;
                    }
                    const loc = await getCurrentPositionAsync({
                        accuracy: Platform.OS === 'android' ? Accuracy.Balanced : Accuracy.High,
                    });
                    if (!cancelled)
                        setData({ lat: loc.coords.latitude, lon: loc.coords.longitude });
                } else {
                    // --- IP Fallback ---
                    const res = await fetch('https://ipapi.co/json/');
                    const ipData = await res.json();
                    if (!cancelled) setData({ lat: ipData.latitude, lon: ipData.longitude });
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err : new Error('Location failed'));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        resolve();
        return () => {
            cancelled = true;
        };
    }, [coords]);

    useSyncToRedux(data, loading, error, {
        set: setLocation,
        setLoading: setLocationLoading,
        setError: setLocationError,
    });
}
