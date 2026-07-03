export type HistoricSiteType = {
  id: number;
  name: string;
  description: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance_offset_meters: number;
  country: string;
  region: string;
};
