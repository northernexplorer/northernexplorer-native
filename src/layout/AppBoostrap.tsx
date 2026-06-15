import {useWeatherBootstrap} from "~/state/hooks/useWeatherBootstrap";
import {useLocationBootstrap} from "~/state/hooks/useLocationBootstrap";
import {useForecastBootstrap} from "~/state/hooks/useForecastBootstrap";
import {useQuoteBootstrap} from "~/state/hooks/useQuoteBootstrap";
import {useLunarBootstrap} from "~/state/hooks/useLunarBootstrap";
import {useCityBootstrap} from "~/state/hooks/useCityBootstrap";

export function AppBootstrap() {
    useLocationBootstrap();
    useWeatherBootstrap();
    useForecastBootstrap();
    useQuoteBootstrap();
    useLunarBootstrap();
    useCityBootstrap();

    return null;
}