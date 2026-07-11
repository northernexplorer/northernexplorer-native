import { ForecastCache, ForecastRepository, WeatherCache, WeatherRepository } from '../environment';
import { EntityManager } from '@mikro-orm/postgresql';
import { CityCache, CityRepository, HistoricSite, HistoricSiteRepository,CountryRepository,Country,Region,RegionRepository } from '../location';
import { User } from '../user';
import { Migration } from '../system';
import { UserRepository } from '../user/repositories/UserRepository';
import { MigrationRepository } from '../system/repositories/MigrationRepository';
export type Repositories = ReturnType<typeof repositories>;

export function repositories(em: EntityManager) {
    return {
        city: new CityRepository(em, CityCache),
        country: new CountryRepository(em,Country),
        Region:new  RegionRepository(em,Region),
        forecast: new ForecastRepository(em, ForecastCache),
        historicSite: new HistoricSiteRepository(em, HistoricSite),
        weather: new WeatherRepository(em, WeatherCache),
        user: new UserRepository(em, User),
        migration: new MigrationRepository(em, Migration),
    };
}
