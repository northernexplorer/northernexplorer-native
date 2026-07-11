import { CityCache, HistoricSite,Country,Region } from '../location';
import { Migration } from '../system';
import { ForecastCache, WeatherCache } from '../environment';
import { User } from '../user';

export const entities = [CityCache, ForecastCache, HistoricSite,Country,Region, Migration, User, WeatherCache];
