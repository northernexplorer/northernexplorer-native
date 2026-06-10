import { useEffect, useState } from "react";
import { getWeather, type WeatherType } from "./getWeather";

export function useWeather(lat?: number, lon?: number) {
    const [data, setData] = useState<WeatherType | null>(null);

    useEffect(() => {
        if (lat == null || lon == null) return;

        (async () => {
            const weather = await getWeather(lat, lon);
            setData(weather);
        })();
    }, [lat, lon]);

    return data;
}