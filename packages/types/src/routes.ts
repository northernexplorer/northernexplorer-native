import { CityType, HistoricSiteType } from './location';
import { ForecastType, LunarCycleType, WeatherType } from './environment';
import { FieldNoteType } from './environment/FieldNote';

export interface ApiMethod<P = unknown, R = unknown, E = string> {
  params: P;
  response: R;
  endpoint: E;
}

export type ControllerDefinition = Record<string, ApiMethod>;

export type CategoryDefinition = Record<string, ControllerDefinition>;

export interface RouteSchema {
  [category: string]: CategoryDefinition;
}

export const ROUTES = {
  authentication: {},
  environment: {
    FieldNoteController: {
      getFieldNoteData: {
        params: { lat: 0, lon: 0 } as { lat: number; lon: number },
        response: null as unknown as FieldNoteType,
        endpoint: '/api/field-note',
      },
    },
    ForecastController: {
      getForecastData: {
        params: { lat: 0, lon: 0 } as { lat: number; lon: number },
        response: null as unknown as ForecastType,
        endpoint: '/api/forecast',
      },
    },
    LunarController: {
      getLunarData: {
        params: {} as Record<string, never>,
        response: null as unknown as LunarCycleType,
        endpoint: '/api/lunar',
      },
    },
    WeatherController: {
      getWeatherData: {
        params: { lat: 0, lon: 0 } as { lat: number; lon: number },
        response: null as unknown as WeatherType,
        endpoint: '/api/weather',
      },
    },
  },
  location: {
    CityController: {
      getCityData: {
        params: { lat: 0, lon: 0 } as { lat: number; lon: number },
        response: null as unknown as CityType,
        endpoint: '/api/city',
      },
    },
    HistoricSiteController: {
      getNearbyHistoricSites: {
        params: { lat: 0, lon: 0 } as { lat: number; lon: number },
        response: null as unknown as HistoricSiteType[],
        endpoint: '/api/nearby-sites',
      },
      getHistoricSiteById: {
        params: { id: 0 } as { id: number },
        response: null as unknown as HistoricSiteType,
        endpoint: '/api/site',
      },
    },
  },
  system: {},
} as const satisfies RouteSchema;

export type ROUTES = typeof ROUTES;
