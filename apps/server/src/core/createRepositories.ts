import { ForecastCache, WeatherCache } from '../environment';
import { EntityManager } from '@mikro-orm/postgresql';
import { CityCache, HistoricSite } from '../location';

export function createRepositories(em: EntityManager) {
  return {
    city: em.getRepository(CityCache),
    forecast: em.getRepository(ForecastCache),
    historicSite: em.getRepository(HistoricSite),
    weather: em.getRepository(WeatherCache),
  };
}
