import { useEffect, useState } from "react";
import { getCity } from "./getCity";

export function useCity(lat?: number, lon?: number) {
    const [cityName, setCityName] = useState<string | null>(null);

    useEffect(() => {
        if (lat == null || lon == null) return;

        (async () => {
            try {
                const locations = await getCity(lat, lon);

                if (locations && locations.length > 0) {
                    const place = locations[0];
                    // Formats as "City, State" (e.g. Paris, Texas) or "City, Country" (e.g. Paris, FR)
                    const formattedName = place.state
                        ? `${place.name}, ${place.state}`
                        : `${place.name}, ${place.country}`;

                    setCityName(formattedName);
                } else {
                    setCityName("Unknown Location");
                }
            } catch (error) {
                console.error(error);
                setCityName("Unknown Location");
            }
        })();
    }, [lat, lon]);

    return cityName;
}