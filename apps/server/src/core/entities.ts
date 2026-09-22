import {CityCache, PointOfInterest, PointOfInterestFavorite, Country, Region, Review, ReviewLike, Organization, Image, ImageLike} from '../location';
import {Migration, Support} from '../system';
import {WeatherCache} from '../environment';
import {Session, Subscription, SubscriptionLevel, User} from '../user';

export const entities = [
	CityCache,
	Country,
	Image,
	ImageLike,
	Migration,
	Organization,
	PointOfInterest,
	PointOfInterestFavorite,
	Region,
	Review,
	ReviewLike,
	Session,
	Subscription,
	SubscriptionLevel,
	Support,
	User,
	WeatherCache,
];
