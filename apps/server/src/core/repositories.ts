import {EntityManager} from '@mikro-orm/postgresql';
import {ForecastCache, ForecastRepository, WeatherCache, WeatherRepository} from '../environment';
import {CityCache, CityRepository, HistoricSite, HistoricSiteRepository, CountryRepository, Country, Region, RegionRepository} from '../location';
import { Review,ReviewRepository } from '../features'
import {
	Session,
	SessionRepository,
	Subscription,
	SubscriptionLevel,
	SubscriptionLevelRepository,
	SubscriptionRepository,
	User,
	UserRepository,
} from '../user';
import {Migration} from '../system';
import {MigrationRepository} from '../system/repositories/MigrationRepository';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(em: EntityManager) {
	return {
		city: new CityRepository(em, CityCache),
		country: new CountryRepository(em, Country),
		region: new RegionRepository(em, Region),
		forecast: new ForecastRepository(em, ForecastCache),
		historicSite: new HistoricSiteRepository(em, HistoricSite),
		weather: new WeatherRepository(em, WeatherCache),
		user: new UserRepository(em, User),
		review: new ReviewRepository(em,Review),
		migration: new MigrationRepository(em, Migration),
		session: new SessionRepository(em, Session),
		subscription: new SubscriptionRepository(em, Subscription),
		subscriptionLevel: new SubscriptionLevelRepository(em, SubscriptionLevel),
		
	};
}
