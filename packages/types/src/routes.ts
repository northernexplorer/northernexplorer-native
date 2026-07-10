import { CityType, HistoricSiteType } from './location';
import { ForecastType, LunarCycleType, WeatherType } from './environment';
import { FieldNoteType } from './environment/FieldNote';
import {
    ChangePasswordParams,
    EditProfileParams,
    ForgotPasswordParams,
    GetByUsernameParams,
    GetByIdResponse,
    LoginParams,
    RefreshParams,
    RegisterParams,
    UserAuthenticationType,
} from './user';
import { GenericResponseType } from './system/GenericResponseType';

export interface ApiMethod<P = unknown, R = unknown> {
    params: P;
    response: R;
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
            },
        },
        ForecastController: {
            getForecastData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as ForecastType,
            },
        },
        LunarController: {
            getLunarData: {
                params: {} as Record<string, never>,
                response: null as unknown as LunarCycleType,
            },
        },
        WeatherController: {
            getWeatherData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as WeatherType,
            },
        },
    },
    location: {
        CityController: {
            getCityData: {
                params: { lat: 0, lon: 0 } as { lat: number; lon: number },
                response: null as unknown as CityType,
            },
        },
        HistoricSiteController: {
            getNearbyHistoricSites: {
                params: { lat: 0, lon: 0, limit: 0 } as { lat: number; lon: number; limit: number },
                response: null as unknown as HistoricSiteType[],
            },
            getHistoricSiteById: {
                params: { id: 0 } as { id: number },
                response: null as unknown as HistoricSiteType,
            },
        },
    },
    system: {
        StatusController: {
            getOnlineStatus: {
                params: { tick: 0 } as { tick: number },
                response: null as unknown as boolean,
            },
        },
        MigrationController: {},
    },
    user: {
        UserController: {
            register: {
                params: {} as RegisterParams,
                response: { success: true } as GenericResponseType,
            },
            login: {
                params: {} as LoginParams,
                response: {} as UserAuthenticationType,
            },
            logout: {
                params: {} as Record<string, never>,
                response: {} as GenericResponseType,
            },
            forgotPassword: {
                params: {} as ForgotPasswordParams,
                response: { success: true } as GenericResponseType,
            },
            editProfile: {
                params: {} as EditProfileParams,
                response: { success: true } as GenericResponseType,
            },
            changePassword: {
                params: {} as ChangePasswordParams,
                response: { success: true } as GenericResponseType,
            },
            getByUsername: {
                params: { username: '' } as GetByUsernameParams,
                response: {} as GetByIdResponse,
            },
            refresh: {
                params: {} as RefreshParams,
                response: {} as UserAuthenticationType,
            },
        },
    },
} as const satisfies RouteSchema;

export type ROUTES = typeof ROUTES;
