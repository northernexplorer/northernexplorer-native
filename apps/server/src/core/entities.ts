import { CityCache, HistoricSite } from '../location';
import { Migrations } from '../system';
import { ForecastCache, WeatherCache } from '../environment';
import { User } from '../user';

export const entities = [CityCache, ForecastCache, HistoricSite, Migrations, User, WeatherCache];
