import {CountryType, RegionType} from '@northernexplorer/types';
import {EntityRepository} from '@mikro-orm/postgresql';
import {HistoricSite} from '../entities/HistoricSite';

interface HistoricSiteRawRow {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: string | number;
	lon: string | number;
	startDate: string | number;
	endDate: string | number;
	country: CountryType;
	region: RegionType;
	distanceMeters: number;
}

export class HistoricSiteRepository extends EntityRepository<HistoricSite> {
	async getHistoricSiteDetails(id: string) {
		const site = await this.findOne({id: String(id)}, {populate: ['country', 'region']});

		if (!site) throw new Error('Historic site not found.');

		return site;
	}

	async getClosestHistoricSites(lat: number, lon: number, limit: number) {
		const query = `
            SELECT id, name, description, image, lat, lon, country  , region ,
                   start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
            FROM (
                     SELECT h.id, h.name, h.description, h.image, h.lat, h.lon, 
					  json_build_object(
                'id', c.id,
                'name', c.name
            ) as country,
          json_build_object(
    'id', r.id,
    'name', r.name,
    'country',
        json_build_object(
            'id', c.id,
            'name', c.name
        )
) AS region,
					 h.start_date, h.end_date,
                            (6371000 * acos(
                                cos(radians(?)) * cos(radians(h.lat)) * cos(radians(h.lon) - radians(?)) +
                                sin(radians(?)) * sin(radians(h.lat))
                                       )) AS distance_meters
                     FROM historic_site h
					 JOIN country c
					 ON h.country_id = c.id
					 JOIN region r
					 ON h.region_id = r.id
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
