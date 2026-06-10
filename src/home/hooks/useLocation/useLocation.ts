import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useLocation() {
    const [coords, setCoords] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});

            if (!mounted) return;

            setCoords({
                lat: loc.coords.latitude,
                lon: loc.coords.longitude,
            });
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return coords;
}