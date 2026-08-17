import {CityCache, PointOfInterest, Country, Region, Review, Organization} from '../location';
import {Migration} from '../system';
import {ForecastCache, WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';
export const entities = [
	CityCache,
	ForecastCache,
	PointOfInterest,
	Country,
	Organization,
	Region,
	Migration,
	Session,
	User,
	WeatherCache,
	Subscription,
	SubscriptionLevel,
	Review,
];
