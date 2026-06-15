import {useWeatherBootstrap} from "~/state/hooks/weather/useWeatherBootstrap";
import {useLocationBootstrap} from "~/state/hooks/location/useLocationBootstrap";
import {useForecastBootstrap} from "~/state/hooks/forecast/useForecastBootstrap";
import {useQuoteBootstrap} from "~/state/hooks/quote/useQuoteBootstrap";
import {useLunarBootstrap} from "~/state/hooks/lunar/useLunarBootstrap";
import {useCityBootstrap} from "~/state/hooks/city/useCityBootstrap";

export function AppBootstrap() {
    useLocationBootstrap();
    useWeatherBootstrap();
    useForecastBootstrap();
    useQuoteBootstrap();
    useLunarBootstrap();
    useCityBootstrap();

    return null;
}