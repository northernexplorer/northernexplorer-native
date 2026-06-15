import {useAppSelector} from "~/state/storeHooks";

export function useWeather() {
    return useAppSelector(s => s.weather.data);
}