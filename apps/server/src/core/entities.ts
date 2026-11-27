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
	ReviewReply,
	ReviewLike,
} from '../location';
import {Article, ArticleCategory, Migration, Notification, Report} from '../system';
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
	Notification,
	Organization,
	PointOfInterest,
	PointOfInterestFavorite,
	PointOfInterestSuggestion,
	Region,
	Report,
	Review,
	ReviewReply,
	ReviewLike,
	Session,
	Subscription,
	SubscriptionLevel,
	Article,
	User,
	WeatherCache,
	WeatherWarningCache,
];
