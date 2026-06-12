import { useEffect, useState } from "react";
import * as Location from "expo-location";

export type CoordinatePayload = {
    lat: number;
    lon: number;
};

export function useLocation() {
    const [coords, setCoords] = useState<CoordinatePayload | null>(null);

    useEffect(() => {
        let mounted = true;

        async function resolvePosition() {
            try {
                // 1. Request hardware GPS permission layer
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status === "granted") {
                    const loc = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });

                    if (!mounted) return;

                    setCoords({
                        lat: loc.coords.latitude,
                        lon: loc.coords.longitude,
                    });
                    return;
                }

                if (__DEV__) {
                    console.log("[Location] Hardware permission denied. Querying IP fallback...");
                }

                const response = await fetch("http://ip-api.com/json/?fields=status,lat,lon");

                if (!response.ok) {
                    throw new Error(`IP Geolocation HTTP error: ${response.status}`);
                }

                const data = await response.json();

                if (!mounted) return;

                if (data && data.status === "success") {
                    setCoords({
                        lat: Number(data.lat),
                        lon: Number(data.lon),
                    });
                } else {
                    console.warn("[Location] IP Geolocation lookup returned an unsuccessful status.");
                }

            } catch (error) {
                console.error("[Location] Failed to resolve location fallback context:", error);
            }
        }

        resolvePosition();

        return () => {
            mounted = false;
        };
    }, []);

    return coords;
}