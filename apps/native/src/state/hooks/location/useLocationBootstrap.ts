import { useAppDispatch, useAppSelector } from '~/state/storeHooks';
import { useEffect } from 'react';
import { setLocation, setLocationError, setLocationLoading } from '~/state/slices/locationSlice';
import {
  Accuracy,
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  getLastKnownPositionAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import { Platform } from 'react-native';

export function useLocationBootstrap() {
  const dispatch = useAppDispatch();
  const coords = useAppSelector((s) => s.location.data);

  useEffect(() => {
    if (coords) return;

    let cancelled = false;

    async function fetchIPFallback() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (cancelled) return;

        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          dispatch(
            setLocation({
              lat: data.latitude,
              lon: data.longitude,
            }),
          );
        } else {
          dispatch(setLocationError('Invalid IP geolocation response'));
        }
      } catch {
        if (!cancelled) {
          dispatch(setLocationError('Location resolution completely failed'));
        }
      }
    }

    async function resolvePosition() {
      try {
        dispatch(setLocationLoading(true));

        // Check existing permission status
        const permissions = await getForegroundPermissionsAsync();
        let granted = permissions.granted;

        // Only request if not granted AND the OS allows us to ask again
        if (!granted && permissions.canAskAgain) {
          const requested = await requestForegroundPermissionsAsync();
          granted = requested.granted;
        }

        // If we have permission, hunt for coordinates
        if (granted) {
          // Fast cache check (instant on emulator/device reloads)
          const cachedLoc = await getLastKnownPositionAsync();
          if (cachedLoc && !cancelled) {
            dispatch(
              setLocation({
                lat: cachedLoc.coords.latitude,
                lon: cachedLoc.coords.longitude,
              }),
            );
            return;
          }

          // Active hardware poll if cache is empty
          const loc = await getCurrentPositionAsync({
            accuracy: Platform.OS === 'android' ? Accuracy.Balanced : Accuracy.High,
          });

          if (cancelled) return;

          dispatch(
            setLocation({
              lat: loc.coords.latitude,
              lon: loc.coords.longitude,
            }),
          );
          return;
        }

        // If permissions are denied or can't ask again, pivot to IP fallback
        await fetchIPFallback();
      } catch {
        // If native hardware polling timed out or failed, fall back to IP as a safety net
        await fetchIPFallback();
      } finally {
        if (!cancelled) {
          dispatch(setLocationLoading(false));
        }
      }
    }

    resolvePosition();

    return () => {
      cancelled = true;
    };
  }, [dispatch, coords]);
}
