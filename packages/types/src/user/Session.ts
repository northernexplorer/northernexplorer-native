export type GetSessionsParams = {
	username: string;
};

export type GetSessionsResponse = {
	id: number;
	version: number;
	clientName: string;
	osName: string;
	platform: string;
	ipAddress: string;
	firstLoginAt: Date;
	lastLoginAt: Date;
};
