import {CityCache, PointOfInterest, Country, Region, Review, ReviewLike, Organization, Image, ImageLike} from '../location';
import {Migration, Report, Support} from '../system';
import {WeatherCache, WeatherWarningCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';

export const entities = [
	CityCache,
	Country,
	Image,
	ImageLike,
	Migration,
	Organization,
	PointOfInterest,
	Region,
	Report,
	Review,
	ReviewLike,
	Session,
	Subscription,
	SubscriptionLevel,
	Support,
	User,
	WeatherCache,
	WeatherWarningCache,
];
