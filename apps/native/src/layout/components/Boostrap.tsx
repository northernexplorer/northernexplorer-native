import { useWeatherBootstrap } from '~/state/slices/weather/useWeatherBootstrap';
import { useLocationBootstrap } from '~/state/slices/location/useLocationBootstrap';
import { useForecastBootstrap } from '~/state/slices/forecast/useForecastBootstrap';
import { useFieldNoteBootstrap } from '~/state/slices/fieldNote/useFieldNoteBootstrap';
import { useLunarBootstrap } from '~/state/slices/lunar/useLunarBootstrap';
import { useCityBootstrap } from '~/state/slices/city/useCityBootstrap';

export function AppBootstrap() {
  useLocationBootstrap();
  useWeatherBootstrap();
  useForecastBootstrap();
  useFieldNoteBootstrap();
  useLunarBootstrap();
  useCityBootstrap();

  return null;
}
