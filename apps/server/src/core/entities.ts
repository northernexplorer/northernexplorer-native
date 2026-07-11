import { CityCache, HistoricSite,Country,Region } from '../location';
import { Migration } from '../system';
import { ForecastCache, WeatherCache } from '../environment';
import { Subscription, SubscriptionLevel, User } from '../user';


export const entities = [
    CityCache,
    ForecastCache,
    HistoricSite,
    Country,
    Region,
    Migration,
    User,
    WeatherCache,
    Subscription,
    SubscriptionLevel,
];

