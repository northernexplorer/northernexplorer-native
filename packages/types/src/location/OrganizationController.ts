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

export const OrganizationController = {
	getAll: {
		params: {} as Record<string, never>,
		response: null as unknown as OrganizationType[],
	},
};
