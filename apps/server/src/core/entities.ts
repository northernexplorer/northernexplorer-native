import { CityCache, HistoricSite } from '../location';
import { Migration } from '../system';
import { ForecastCache, WeatherCache } from '../environment';
import { Membership, MembershipLevel, User } from '../user';

export const entities = [
    CityCache,
    ForecastCache,
    HistoricSite,
    Migration,
    User,
    WeatherCache,
    Membership,
    MembershipLevel,
];
