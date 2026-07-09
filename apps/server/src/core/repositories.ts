import { ForecastCache, ForecastRepository, WeatherCache, WeatherRepository } from '../environment';
import { EntityManager } from '@mikro-orm/postgresql';
import { CityCache, CityRepository, HistoricSite, HistoricSiteRepository } from '../location';
import {
    Membership,
    MembershipLevel,
    MembershipLevelRepository,
    MembershipRepository,
    User,
    UserRepository,
} from '../user';
import { Migration } from '../system';
import { MigrationRepository } from '../system/repositories/MigrationRepository';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(em: EntityManager) {
    return {
        city: new CityRepository(em, CityCache),
        forecast: new ForecastRepository(em, ForecastCache),
        historicSite: new HistoricSiteRepository(em, HistoricSite),
        weather: new WeatherRepository(em, WeatherCache),
        user: new UserRepository(em, User),
        migration: new MigrationRepository(em, Migration),
        membership: new MembershipRepository(em, Membership),
        membershipLevel: new MembershipLevelRepository(em, MembershipLevel),
    };
}
