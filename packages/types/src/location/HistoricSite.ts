export type HistoricSiteType = {
  id: number;
  name: string;
  description: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  region?: string | null;
};
