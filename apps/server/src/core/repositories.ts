import {EntityManager} from '@mikro-orm/postgresql';
import {WeatherCache, WeatherRepository} from '../environment';
import {
	CityCache,
	CityRepository,
	Country,
	CountryRepository,
	Image,
	ImageLike,
	ImageLikeRepository,
	ImageRepository,
	Organization,
	OrganizationRepository,
	PointOfInterest,
	PointOfInterestFavorite,
	PointOfInterestFavoriteRepository,
	PointOfInterestRepository,
	PointOfInterestSuggestion,
	PointOfInterestSuggestionRepository,
	Region,
	RegionRepository,
	Review,
	ReviewLike,
	ReviewLikeRepository,
	ReviewRepository,
} from '../location';
import {
	Avatar,
	AvatarRepository,
	Session,
	SessionRepository,
	Subscription,
	SubscriptionFeatureRepository,
	SubscriptionLevel,
	SubscriptionLevelRepository,
	SubscriptionRepository,
	User,
	UserRepository,
} from '../user';
import {Article, ArticleRepository, Report, ReportRepository} from '../system';
import {SubscriptionFeature} from '../user/entities/SubscriptionFeature';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(em: EntityManager) {
	return {
		avatar: new AvatarRepository(em, Avatar),
		city: new CityRepository(em, CityCache),
		country: new CountryRepository(em, Country),
		image: new ImageRepository(em, Image),
		imageLike: new ImageLikeRepository(em, ImageLike),
		organization: new OrganizationRepository(em, Organization),
		pointOfInterest: new PointOfInterestRepository(em, PointOfInterest),
		pointOfInterestSuggestion: new PointOfInterestSuggestionRepository(em, PointOfInterestSuggestion),
		pointOfInterestFavorite: new PointOfInterestFavoriteRepository(em, PointOfInterestFavorite),
		region: new RegionRepository(em, Region),
		report: new ReportRepository(em, Report),
		review: new ReviewRepository(em, Review),
		reviewLike: new ReviewLikeRepository(em, ReviewLike),
		session: new SessionRepository(em, Session),
		subscription: new SubscriptionRepository(em, Subscription),
		subscriptionFeature: new SubscriptionFeatureRepository(em, SubscriptionFeature),
		subscriptionLevel: new SubscriptionLevelRepository(em, SubscriptionLevel),
		article: new ArticleRepository(em, Article),
		user: new UserRepository(em, User),
		weather: new WeatherRepository(em, WeatherCache),
	};
}
