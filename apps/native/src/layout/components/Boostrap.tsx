import {useWeatherBootstrap} from "~/state/hooks/weather/useWeatherBootstrap";
import {useLocationBootstrap} from "~/state/hooks/location/useLocationBootstrap";
import {useForecastBootstrap} from "~/state/hooks/forecast/useForecastBootstrap";
import {useFieldNoteBootstrap} from "~/state/hooks/fieldNote/useFieldNoteBootstrap";
import {useLunarBootstrap} from "~/state/hooks/lunar/useLunarBootstrap";
import {useCityBootstrap} from "~/state/hooks/city/useCityBootstrap";

export function AppBootstrap() {
    useLocationBootstrap();
    useWeatherBootstrap();
    useForecastBootstrap();
    useFieldNoteBootstrap();
    useLunarBootstrap();
    useCityBootstrap();

    return null;
}