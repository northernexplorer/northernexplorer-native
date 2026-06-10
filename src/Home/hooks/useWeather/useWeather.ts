import { useEffect, useState } from "react";
import {requestForegroundPermissionsAsync, getCurrentPositionAsync} from "expo-location";
import { getWeather, type Weather } from "./getWeather";

export function useWeather() {
    const [data, setData] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { status } =
                    await requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    setError("Location permission denied");
                    return;
                }

                const location = await getCurrentPositionAsync({});

                const weather = await getWeather(
                    location.coords.latitude,
                    location.coords.longitude,
                );

                if (mounted) {
                    setData(weather);
                }
            } catch (e) {
                if (mounted) {
                    setError(
                        e instanceof Error ? e.message : "Unknown error",
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return { data, loading, error };
}