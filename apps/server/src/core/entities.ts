import {
	CityCache,
	Country,
	Image,
	ImageLike,
	Organization,
	PointOfInterest,
	PointOfInterestFavorite,
	PointOfInterestSuggestion,
	Region,
	Review,
	ReviewLike,
} from '../location';
import {Article, ArticleCategory, Migration, Report} from '../system';
import {WeatherCache, WeatherWarningCache} from '../environment';
import {Avatar, Session, Subscription, SubscriptionLevel, User} from '../user';

export const entities = [
	Avatar,
	ArticleCategory,
	CityCache,
	Country,
	Image,
	ImageLike,
	Migration,
	Organization,
	PointOfInterest,
	PointOfInterestFavorite,
	PointOfInterestSuggestion,
	Region,
	Report,
	Review,
	ReviewLike,
	Session,
	Subscription,
	SubscriptionLevel,
	Article,
	User,
	WeatherCache,
	WeatherWarningCache,
];
