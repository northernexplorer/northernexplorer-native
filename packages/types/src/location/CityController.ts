export type CityType = {
	id: string;
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	url: string;
};

export const CityController = {
	getCityData: {
		params: {} as {lat: number; lon: number},
		response: null as unknown as CityType,
	},
};
