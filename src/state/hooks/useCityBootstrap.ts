import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import { setCity, setCityLoading, setCityError } from "~/state/slices/citySlice";
import { getCity } from "./get/getCity";

export function useCityBootstrap() {
    const dispatch = useAppDispatch();
    const coords = useAppSelector((s) => s.location.data);
    const city = useAppSelector((s) => s.city.data);

    useEffect(() => {
        if (!coords) return;

        let cancelled = false;

        const { lat, lon } = coords;

        async function run() {
            try {
                dispatch(setCityLoading(true));

                const location = await getCity(lat, lon);

                if (cancelled) return;

                dispatch(setCity(location));
            } catch {
                if (!cancelled) {
                    dispatch(setCityError("Failed to resolve city"));
                }
            } finally {
                if (!cancelled) {
                    dispatch(setCityLoading(false));
                }
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [coords, city, dispatch]);
}