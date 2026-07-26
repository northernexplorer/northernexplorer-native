import {RegionType} from '@northernexplorer/types';
import {HistoricSite} from '../entities/HistoricSite';
import {EntityRepository} from '@mikro-orm/postgresql';
import { ReviewType } from '../../../../../packages/types/src/features/Review';

interface HistoricSiteRawRow {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: string | number;
	lon: string | number;
	startDate: string | number;
	endDate: string | number;
	country: {id: string; name: string};
	region: RegionType;
	reviews:ReviewType
	distanceMeters: number;
}

export class HistoricSiteRepository extends EntityRepository<HistoricSite> {
	async getHistoricSiteDetails(id: string) {
		const site = await this.findOne({id:id}, {populate: ['country', 'region','reviews']});

		if (!site) throw new Error('Historic site not found.');

		return site;
	}

	async getClosestHistoricSites(lat: number, lon: number, limit: number) {
		const query = `
          SELECT id, name, description, image, lat, lon, country  , region , reviews ,
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
 coalesce(
 json_agg(
    json_build_object(
	   'id', rev.id,
            'rating', rev.rating,
            'user', json_build_object(
                'id', u.id,
                'name', u.username
            )
	)
	)
FILTER (WHERE rev.id IS NOT NULL),
    '[]'	) as reviews,

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
					 LEFT JOIN review rev
    ON rev.historic_site_id = h.id
LEFT JOIN "user" u
    ON rev.user_id = u.id
				GROUP BY 
    h.id,
    c.id,
    r.id 
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
			review:site.reviews,
			lat: Number(site.lat),
			lon: Number(site.lon),
			startDate: site.startDate ? Number(site.startDate) : null,
			endDate: site.endDate ? Number(site.endDate) : null,
		}));
	}
}
