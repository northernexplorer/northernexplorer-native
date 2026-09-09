import {EntityManager} from '@mikro-orm/postgresql';
import {WeatherCache, WeatherRepository} from '../environment';
import {
	CityCache,
	CityRepository,
	PointOfInterest,
	PointOfInterestRepository,
	CountryRepository,
	Country,
	Region,
	RegionRepository,
	Review,
	ReviewRepository,
	OrganizationRepository,
	Organization,
	Image,
	ImageRepository,
	ImageLikeRepository,
	ImageLike,
} from '../location';
import {
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
import {Migration, Support, SupportRepository} from '../system';
import {MigrationRepository} from '../system/repositories/MigrationRepository';
import {SubscriptionFeature} from '../user/entities/SubscriptionFeature';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(em: EntityManager) {
	return {
		city: new CityRepository(em, CityCache),
		country: new CountryRepository(em, Country),
		image: new ImageRepository(em, Image),
		imageLike: new ImageLikeRepository(em, ImageLike),
		organization: new OrganizationRepository(em, Organization),
		migration: new MigrationRepository(em, Migration),
		pointOfInterest: new PointOfInterestRepository(em, PointOfInterest),
		region: new RegionRepository(em, Region),
		review: new ReviewRepository(em, Review),
		session: new SessionRepository(em, Session),
		subscription: new SubscriptionRepository(em, Subscription),
		subscriptionFeature: new SubscriptionFeatureRepository(em, SubscriptionFeature),
		subscriptionLevel: new SubscriptionLevelRepository(em, SubscriptionLevel),
		support: new SupportRepository(em, Support),
		user: new UserRepository(em, User),
		weather: new WeatherRepository(em, WeatherCache),
	};
}
