export type CityType = {
	id: number;
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	url: string;
};

export interface CityResponse {
	source: 'database_cache' | 'weatherapi_data';
	distance_offset?: string;
	cached_at?: string;
	data: CityType[];
}
