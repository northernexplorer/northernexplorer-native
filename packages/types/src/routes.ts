import {CityType, HistoricSiteType} from './location';
import {ForecastType, LunarCycleType, WeatherType, FieldNoteType} from './environment';

import {CountryType} from './location/Country';
import {RegionType} from './location/Region';

import {
    ChangePasswordParams,
    EditProfileParams,
    ForgotPasswordParams,
    GetByUsernameParams,
    LoginParams,
    RefreshParams,
    RegisterParams,
    UserAuthenticationType,
    GetByUsernameResponse,
    ActivateParams,
    ResetPasswordParams,
    GetSessionsParams,
    GetSessionsResponse,
    LogoutParams,
    RemoveSessionParams,
    SubscriptionLevelsResponse, ChangeSubscriptionParams,
} from './user';
import {GenericResponseType} from './system/GenericResponseType';
import {SubscriptionParams, SubscriptionResponse} from './user';

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
				params: {lat: 0, lon: 0} as {lat: number; lon: number},
				response: null as unknown as FieldNoteType,
			},
		},
		ForecastController: {
			getForecastData: {
				params: {lat: 0, lon: 0} as {lat: number; lon: number},
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
				params: {lat: 0, lon: 0} as {lat: number; lon: number},
				response: null as unknown as WeatherType,
			},
		},
	},
	location: {
		CityController: {
			getCityData: {
				params: {lat: 0, lon: 0} as {lat: number; lon: number},
				response: null as unknown as CityType,
			},
		},
		HistoricSiteController: {
			getNearbyHistoricSites: {
				params: {lat: 0, lon: 0, limit: 0} as {lat: number; lon: number; limit: number},
				response: null as unknown as HistoricSiteType[],
			},
			getHistoricSiteById: {
				params: {id: 0} as {id: number},
				response: null as unknown as HistoricSiteType,
			},
		},
		CountryController: {
			getCountryById: {
				params: {id: ''} as {id: string},
				response: null as unknown as CountryType,
			},
		},
		RegionController: {
			getRegionById: {
				params: {id: ''} as {id: string},
				response: null as unknown as RegionType,
			},
		},
	},
	system: {
		StatusController: {
			getOnlineStatus: {
				params: {tick: 0} as {tick: number},
				response: null as unknown as boolean,
			},
		},
		MigrationController: {},
	},
	user: {
		SessionController: {
			getSessions: {
				params: {} as GetSessionsParams,
				response: {} as GetSessionsResponse[],
			},
			removeSession: {
				params: {} as RemoveSessionParams,
				response: {} as GenericResponseType,
			},
		},
		SubscriptionController: {
			getByUsername: {
				params: {} as SubscriptionParams,
				response: {} as SubscriptionResponse,
			},
			changeSubscription: {
				params: {} as ChangeSubscriptionParams,
				response: {} as GenericResponseType,
			},
		},
		SubscriptionLevelController: {
			getSubscriptionLevels: {
				params: {} as Record<string, never>,
				response: {} as SubscriptionLevelsResponse[],
			},
		},
		UserController: {
			register: {
				params: {} as RegisterParams,
				response: {success: true} as GenericResponseType,
			},
			login: {
				params: {} as LoginParams,
				response: {} as UserAuthenticationType,
			},
			logout: {
				params: {} as LogoutParams,
				response: {} as GenericResponseType,
			},
			forgotPassword: {
				params: {} as ForgotPasswordParams,
				response: {success: true} as GenericResponseType,
			},
			editProfile: {
				params: {} as EditProfileParams,
				response: {success: true} as GenericResponseType,
			},
			changePassword: {
				params: {} as ChangePasswordParams,
				response: {success: true} as GenericResponseType,
			},
			getByUsername: {
				params: {} as GetByUsernameParams,
				response: {} as GetByUsernameResponse,
			},
			refresh: {
				params: {} as RefreshParams,
				response: {} as UserAuthenticationType,
			},
			activate: {
				params: {} as ActivateParams,
				response: {} as UserAuthenticationType,
			},
			resetPassword: {
				params: {} as ResetPasswordParams,
				response: {} as GenericResponseType,
			},
		},
	},
} as const satisfies RouteSchema;

export type ROUTES = typeof ROUTES;
