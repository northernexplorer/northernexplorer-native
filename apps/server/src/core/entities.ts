import {CityCache, HistoricSite, Country, Region, Review} from '../location';
import {Migration} from '../system';
import {ForecastCache, WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';
export const entities = [
	CityCache,
	ForecastCache,
	HistoricSite,
	Country,
	Region,
	Migration,
	Session,
	User,
	WeatherCache,
	Subscription,
	SubscriptionLevel,
	Review,
];
