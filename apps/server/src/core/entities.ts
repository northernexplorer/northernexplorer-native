import {CityCache, PointOfInterest, Country, Region, Review, Organization, Image} from '../location';
import {Migration, Support} from '../system';
import {WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';

export const entities = [
	CityCache,
	Country,
	Image,
	Migration,
	Organization,
	PointOfInterest,
	Region,
	Review,
	Session,
	Subscription,
	SubscriptionLevel,
	Support,
	User,
	WeatherCache,
];
