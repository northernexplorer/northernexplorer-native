export type HistoricSiteType = {
	id: number;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country: string;
	region: string;
	startDate?: number | null;
	endDate?: number | null;
};
