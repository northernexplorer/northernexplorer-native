export type GetSessionsParams = {
	username: string;
	refreshToken: string;
};

export type GetSessionsResponse = {
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

export type RemoveSessionParams = {
	sessionid: string;
};
