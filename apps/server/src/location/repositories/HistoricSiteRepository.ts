import {HistoricSite} from '../entities/HistoricSite';
import {EntityRepository} from '@mikro-orm/postgresql';

interface HistoricSiteRawRow {
	id: number;
	name: string;
	description: string;
	image: string;
	lat: string | number;
	lon: string | number;
	startDate: string | number;
	endDate: string | number;
	country: string;
	region: string;
	distanceMeters: number;
}

export class HistoricSiteRepository extends EntityRepository<HistoricSite> {
	async getHistoricSiteDetails(id: number) {
		const site = await this.findOne({id: Number(id)});
		if (!site) throw new Error("We couldn't find the historic site you are looking for.");

		return site;
	}

	async getClosestHistoricSites(lat: number, lon: number, limit: number) {
		const query = `
            SELECT id, name, description, image, lat, lon, country, region,
                   start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
            FROM (
                     SELECT id, name, description, image, lat, lon, country, region, start_date, end_date,
                            (6371000 * acos(
                                cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) +
                                sin(radians(?)) * sin(radians(lat))
                                       )) AS distance_meters
                     FROM historic_site
                 ) AS spatial_search
            ORDER BY distanceMeters ASC
                LIMIT ?
        `;

		const rawResults = (await this.em.getConnection().execute(query, [lat, lon, lat, limit])) as unknown as HistoricSiteRawRow[];

		return rawResults.map(site => ({
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			country: site.country,
			region: site.region,
			lat: Number(site.lat),
			lon: Number(site.lon),
			startDate: site.startDate ? Number(site.startDate) : null,
			endDate: site.endDate ? Number(site.endDate) : null,
		}));
	}
}
