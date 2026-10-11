export enum OrganizationTypeEnum {
	Government = 'Government',
	Charity = 'Charity',
	NonProfit = 'NonProfit',
	Private = 'Private',
}

export type OrganizationType = {
	id: string;
	name: string;
};

export type OrganizationCreateType = {
	name: string;
	regionIds?: string[];
	regionId?: string;
};

export const OrganizationController = {
	getAll: {
		params: {} as {regionId?: string; id?: string} | Record<string, never>,
		response: null as unknown as OrganizationType[],
	},
	getByRegionId: {
		params: {} as {id: string},
		response: null as unknown as OrganizationType[],
	},
	create: {
		params: {} as OrganizationCreateType,
		response: null as unknown as OrganizationType,
	},
};
