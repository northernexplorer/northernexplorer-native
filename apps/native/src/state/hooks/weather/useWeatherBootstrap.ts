import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import {
    setWeather,
    setWeatherLoading,
    setWeatherError,
} from "~/state/slices/weatherSlice";
import { getWeather } from "./getWeather";

export function useWeatherBootstrap() {
    const dispatch = useAppDispatch();
    const coords = useAppSelector((s) => s.location.data);
    const { data, lastUpdated } = useAppSelector((s) => s.weather);

    useEffect(() => {
        if (!coords) return;

        const STALE_TIME = 1000 * 60 * 30;

        const isStale =
            !lastUpdated ||
            Date.now() - lastUpdated > STALE_TIME;

        if (data && !isStale) return;

        let cancelled = false;

        const { lat, lon } = coords;

        async function run() {
            try {
                dispatch(setWeatherLoading(true));

                const result = await getWeather(
                    lat,
                    lon
                );

                if (cancelled) return;

                dispatch(setWeather(result));
            } catch {
                if (!cancelled) {
                    dispatch(setWeatherError("Failed to fetch weather"));
                }
            } finally {
                if (!cancelled) {
                    dispatch(setWeatherLoading(false));
                }
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [coords, data, lastUpdated, dispatch]);
}