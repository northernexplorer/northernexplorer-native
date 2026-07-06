import { useWeatherBootstrap } from '~/environment/state/weather/useWeatherBootstrap';
import { useLocationBootstrap } from '~/location/state/location/useLocationBootstrap';
import { useForecastBootstrap } from '~/environment/state/forecast/useForecastBootstrap';
import { useFieldNoteBootstrap } from '~/environment/state/fieldNote/useFieldNoteBootstrap';
import { useLunarBootstrap } from '~/environment/state/lunar/useLunarBootstrap';
import { useCityBootstrap } from '~/location/state/city/useCityBootstrap';

export function AppBootstrap() {
    useLocationBootstrap();
    useWeatherBootstrap();
    useForecastBootstrap();
    useFieldNoteBootstrap();
    useLunarBootstrap();
    useCityBootstrap();

    return null;
}
