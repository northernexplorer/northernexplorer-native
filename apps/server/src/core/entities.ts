import {CityCache, PointOfInterest, Country, Region, Review, Organization} from '../location';
import {Migration, Support} from '../system';
import {WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';

export const entities = [
	CityCache,
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
	Support,
];
