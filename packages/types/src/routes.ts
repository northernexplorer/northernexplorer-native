import { CityType, HistoricSiteType } from './location';
import { ForecastType, LunarCycleType, WeatherType } from './environment';
import { FieldNoteType } from './environment/FieldNote';
import {
    ChangePasswordParams,
    EditProfileParams,
    ForgotPasswordParams,
    GetByIdParams, GetByIdResponse,
    LoginParams,
    LoginResponse, RefreshParams,
    RegisterParams, UserAuthenticationType,
} from './user';
import { GenericResponseType } from './system/GenericResponseType';

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
    environment: {
        FieldNoteController: {
            getFieldNoteData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as FieldNoteType,
                endpoint: 'getFieldNoteData',
            },
        },
        ForecastController: {
            getForecastData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as ForecastType,
                endpoint: 'getForecastData',
            },
        },
        LunarController: {
            getLunarData: {
                params: {} as Record<string, never>,
                response: null as unknown as LunarCycleType,
                endpoint: 'getLunarData',
            },
        },
        WeatherController: {
            getWeatherData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as WeatherType,
                endpoint: 'getWeatherData',
            },
        },
    },
    location: {
        CityController: {
            getCityData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as CityType,
                endpoint: 'getCityData',
            },
        },
        HistoricSiteController: {
            getNearbyHistoricSites: {
                params: { lat: 0, lon: 0, limit: 0 } as { lat: number; lon: number; limit: number },
                response: null as unknown as HistoricSiteType[],
                endpoint: 'getNearbyHistoricSites',
            },
            getHistoricSiteById: {
                params: { id: 0 } as { id: number },
                response: null as unknown as HistoricSiteType,
                endpoint: 'getHistoricSiteById',
            },
        },
    },
    system: {
        StatusController: {
            getOnlineStatus: {
                params: { tick: 0 } as { tick: number },
                response: null as unknown as boolean,
                endpoint: 'getOnlineStatus',
            },
        },
        MigrationController: {},
    },
    user: {
        UserController: {
            register: {
                params: {} as RegisterParams,
                response: { success: true } as GenericResponseType,
                endpoint: 'register',
            },
            login: {
                params: {} as LoginParams,
                response: {} as UserAuthenticationType,
                endpoint: 'login',
            },
            forgotPassword: {
                params: {} as ForgotPasswordParams,
                response: null as null,
                endpoint: 'forgotPassword',
            },
            editProfile: {
                params: {} as EditProfileParams,
                response: true as boolean,
                endpoint: 'editProfile',
            },
            changePassword: {
                params: {} as ChangePasswordParams,
                response: null as null,
                endpoint: 'changePassword',
            },
            getById: {
                params: { id: 0 } as GetByIdParams,
                response: {} as GetByIdResponse,
                endpoint: 'getById',
            },
            refresh: {
                params: {} as RefreshParams,
                response: {} as UserAuthenticationType,
                endpoint: 'refresh',
            },
        },
    },
} as const satisfies RouteSchema;

export type ROUTES = typeof ROUTES;
