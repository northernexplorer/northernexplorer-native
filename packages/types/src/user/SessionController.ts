import {GenericResponseType} from '../GenericResponseType';

type GetByUsernameParams = {
	username: string;
	refreshToken: string;
};

type GetByUsernameResponse = {
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

type DeleteByIdParams = {
	sessionId: string;
};

export const SessionController = {
	getByUsername: {
		params: {} as GetByUsernameParams,
		response: {} as GetByUsernameResponse[],
	},
	deleteById: {
		params: {} as DeleteByIdParams,
		response: {} as GenericResponseType,
	},
};
