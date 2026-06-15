import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import { useEffect } from "react";
import {
    setLocation,
    setLocationError,
    setLocationLoading,
} from "~/state/slices/locationSlice";
import {
    Accuracy,
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
} from "expo-location";

export function useLocationBootstrap() {
    const dispatch = useAppDispatch();
    const coords = useAppSelector((s) => s.location.data);

    useEffect(() => {
        if (coords) return;

        let cancelled = false;

        async function resolvePosition() {
            try {
                dispatch(setLocationLoading(true));

                const { status } =
                    await requestForegroundPermissionsAsync();

                if (status === "granted") {
                    const loc = await getCurrentPositionAsync({
                        accuracy: Accuracy.Balanced,
                    });

                    if (cancelled) return;

                    dispatch(
                        setLocation({
                            lat: loc.coords.latitude,
                            lon: loc.coords.longitude,
                        })
                    );

                    return;
                }

                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();

                if (cancelled) return;

                if (
                    typeof data.latitude === "number" &&
                    typeof data.longitude === "number"
                ) {
                    dispatch(
                        setLocation({
                            lat: data.latitude,
                            lon: data.longitude,
                        })
                    );
                } else {
                    dispatch(setLocationError("Invalid IP geolocation response"));
                }
            } catch {
                if (!cancelled) {
                    dispatch(setLocationError("Location resolution failed"));
                }
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
    }, [dispatch]);
}