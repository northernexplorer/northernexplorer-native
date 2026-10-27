import {useWeatherBootstrap} from '~/environment/state/weather/useWeatherBootstrap';
import {useLocationBootstrap} from '~/location/state/location/useLocationBootstrap';
import {useLunarBootstrap} from '~/environment/state/lunar/useLunarBootstrap';
import {useCityBootstrap} from '~/location/state/city/useCityBootstrap';
import {useSubscriptionBootstrap} from '~/user/state/subscription/useSubscriptionBootstrap';

export function AppBootstrap() {
	useLocationBootstrap();
	useWeatherBootstrap();
	useLunarBootstrap();
	useCityBootstrap();
	useSubscriptionBootstrap();

	return null;
}
