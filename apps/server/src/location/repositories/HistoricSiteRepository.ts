import {CountryType, PublishStatusEnum, RegionType, ReviewType, ReviewSummary} from '@northernexplorer/types';
import {EntityRepository} from '@mikro-orm/postgresql';
import {PointOfInterest} from '../entities/PointOfInterest';

interface PointOfInterestRawRow {
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
	reviews: ReviewType;
	distanceMeters: number;
	status: PublishStatusEnum;
}

type PointOfInterestDetailsResponse = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	status: PublishStatusEnum;
	country: CountryType;
	region: RegionType;
	reviews: ReviewSummary[];
};

export class PointOfInterestRepository extends EntityRepository<PointOfInterest> {
	async getPointOfInterestDetails(id: string): Promise<PointOfInterestDetailsResponse> {
		const site = await this.findOneOrFail({id: id}, {populate: ['country', 'region', 'reviews', 'reviews.user']});

		return {
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			lat: site.lat,
			lon: site.lon,
			country: site.country,
			region: site.region,
			status: site.status,
			reviews: site.reviews.map(review => ({
				id: review.id,
				description: review.description,
				rating: review.rating,
				user: {
					id: review.user.id,
					username: review.user.username,
					score: review.user.score,
				},
			})),
		};
	}

	async getClosestPointOfInterests(lat: number, lon: number, limit: number) {
		const query = `
			SELECT id, name, description, image, lat, lon, country, region, status,
			       start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
			FROM (
					 SELECT h.id, h.name, h.description, h.image, h.lat, h.lon, h.status,
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
				     WHERE h.status = 'Published'
				 ) AS spatial_search
			ORDER BY distanceMeters ASC
				LIMIT ?
		`;

		const rawResults = (await this.em.getConnection().execute(query, [lat, lon, lat, limit])) as unknown as PointOfInterestRawRow[];

		return rawResults.map(site => ({
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			country: site.country,
			region: site.region,
			review: site.reviews,
			lat: Number(site.lat),
			lon: Number(site.lon),
			startDate: site.startDate ? Number(site.startDate) : undefined,
			endDate: site.endDate ? Number(site.endDate) : undefined,
			status: site.status,
		}));
	}

	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	getDrafts() {
		return this.find({status: PublishStatusEnum.Draft}, {orderBy: {createdAt: 'asc', name: 'asc'}, populate: ['region', 'country']});
	}

	getPublished() {
		return this.find({status: PublishStatusEnum.Published}, {orderBy: {name: 'asc'}, populate: ['region', 'country']});
	}
}
