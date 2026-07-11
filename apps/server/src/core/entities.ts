import { CityCache, HistoricSite } from '../location';
import { Migration } from '../system';
import { ForecastCache, WeatherCache } from '../environment';
import { Subscription, SubscriptionLevel, User } from '../user';

export const entities = [
    CityCache,
    ForecastCache,
    HistoricSite,
    Migration,
    User,
    WeatherCache,
    Subscription,
    SubscriptionLevel,
];
