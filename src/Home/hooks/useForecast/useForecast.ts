import { useEffect, useState } from "react";
import { getForecast, type ForecastType } from "./getForecast";

export function useForecast(lat?: number, lon?: number) {
    const [data, setData] = useState<ForecastType | null>(null);

    useEffect(() => {
        if (lat == null || lon == null) return;

        (async () => {
            const forecast = await getForecast(lat, lon);
            setData(forecast);
        })();
    }, [lat, lon]);

    return data;
}