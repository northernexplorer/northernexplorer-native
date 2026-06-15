import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import { setCity, setCityLoading, setCityError } from "~/state/slices/citySlice";
import { getCity } from "./get/getCity";

export function useCityBootstrap() {
    const dispatch = useAppDispatch();
    const coords = useAppSelector((s) => s.location.data);
    const city = useAppSelector((s) => s.city.name);

    useEffect(() => {
        if (!coords) return;
        if (city) return;

        (async () => {
            try {
                dispatch(setCityLoading(true));

                const locations = await getCity(coords.lat, coords.lon);

                if (locations && locations.length > 0) {
                    const place = locations[0];

                    const formattedName = place.state
                        ? `${place.name}, ${place.state}`
                        : `${place.name}, ${place.country}`;

                    dispatch(setCity(formattedName));
                } else {
                    dispatch(setCity("Unknown Location"));
                }
            } catch (error) {
                dispatch(setCityError("Failed to resolve city"));
            } finally {
                dispatch(setCityLoading(false));
            }
        })();
    }, [coords, city, dispatch]);
}