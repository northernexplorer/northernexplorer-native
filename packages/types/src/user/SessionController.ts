import {GenericResponseType} from '../GenericResponseType';

type GetSessionsParams = {
	username: string;
	refreshToken: string;
};

type GetSessionsResponse = {
	id: string;
	version: number;
	clientName: string;
	osName: string;
	platform: string;
	ipAddress: string;
	firstLoginAt: Date;
	lastLoginAt: Date;
	active: boolean;
};

type RemoveSessionParams = {
	sessionId: string;
};

export const SessionController = {
	getSessions: {
		params: {} as GetSessionsParams,
		response: {} as GetSessionsResponse[],
	},
	removeSession: {
		params: {} as RemoveSessionParams,
		response: {} as GenericResponseType,
	},
};
