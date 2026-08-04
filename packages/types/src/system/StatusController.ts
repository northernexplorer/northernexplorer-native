export const StatusController = {
	getStatus: {
		params: {} as {tick: number; androidVersion: string; iosVersion: string},
		response: {} as {online: boolean; upgradeRequired: boolean},
	},
	getOverview: {
		params: {} as Record<string, never>,
		response: {} as {users: number; historicSitesPublished: number; historicSitesDraft: number},
	},
};
