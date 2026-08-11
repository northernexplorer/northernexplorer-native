import {CityCache, PointOfInterest, Country, Region, Review} from '../location';
import {Migration} from '../system';
import {ForecastCache, WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';
export const entities = [
	CityCache,
	ForecastCache,
	PointOfInterest,
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
