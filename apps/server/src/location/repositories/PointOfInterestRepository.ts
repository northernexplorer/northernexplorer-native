import {
	CountryType,
	OrganizationType,
	PointOfInterestType,
	PointOfInterestTypeEnum,
	PublishStatusEnum,
	RegionType,
	ReviewStatusEnum,
	ReviewSummary,
	ReviewType,
	VisitedFilterEnum,
} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
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
	type: PointOfInterestTypeEnum[];
	organization: OrganizationType;
}

export class PointOfInterestRepository extends BaseRepository<PointOfInterest> {
	async getPointOfInterestById(id: string, currentUserId?: string): Promise<PointOfInterestType> {
		const site = await this.findOneOrFail(
			{id},
			{populate: ['country', 'region', 'reviews', 'reviews.user', 'organization', 'images', 'images.user']},
		);

		// Filter reviews: show published reviews OR reviews belonging to the current user
		const visibleReviews = site.reviews.filter(review => review.status === ReviewStatusEnum.Approved || review.user.id === currentUserId);

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
			type: site.type,
			organization: site.organization,
			reviews: visibleReviews.map(review => ({
				id: review.id,
				description: review.description,
				rating: review.rating,
				difficulty: review.difficulty,
				entranceCost: review.entranceCost,
				conditions: review.conditions,
				status: review.status,
				user: {
					id: review.user.id,
					username: review.user.username,
					score: review.user.score,
					firstName: review.user.firstName,
					lastName: review.user.lastName,
				},
			})),
			images: site.images.map(image => ({
				id: image.id,
				version: image.version,
				url: image.url,
				fileExtension: image.fileExtension,
				filename: image.filename,
				mimeType: image.mimeType,
				size: image.size,
				likes: image.likes,
				altText: image.altText,
				processed: image.processed,
				createdAt: image.createdAt,
				status: image.status,
				user: {
					id: image.user.id,
					username: image.user.username,
					score: image.user.score,
					firstName: image.user.firstName,
					lastName: image.user.lastName,
				},
			})),
		};
	}

	async getClosestPointOfInterests(
		lat: number,
		lon: number,
		limit: number,
		userId?: string,
		selectedPoiTypes: PointOfInterestTypeEnum[] = [],
		visitedFilter: VisitedFilterEnum = VisitedFilterEnum.All,
	) {
		const params: unknown[] = [];

		const applyVisitedFilter = Boolean(userId) && visitedFilter !== VisitedFilterEnum.All;

		let userJoinSql = '';
		let visitedFilterSql = '';

		if (applyVisitedFilter) {
			userJoinSql = `
           LEFT JOIN review rev 
             ON rev.point_of_interest_id = h.id 
            AND rev.user_id = ?
       `;

			if (visitedFilter === VisitedFilterEnum.Visited) {
				visitedFilterSql = `AND rev.id IS NOT NULL`;
			} else {
				visitedFilterSql = `AND rev.id IS NULL`;
			}
		}

		params.push(lat, lon, lat);

		if (applyVisitedFilter) {
			params.push(userId);
		}

		const hasTypeFilter = selectedPoiTypes.length > 0;
		const typeFilterSql = hasTypeFilter ? `AND h.type && ?::text[]` : '';
		if (hasTypeFilter) {
			params.push(`{${selectedPoiTypes.join(',')}}`);
		}

		params.push(limit);

		const query = `
			SELECT id, name, description, image, lat, lon, country, region, status, type,
			       start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
			FROM (
					 SELECT h.id, h.name, h.description, h.image, h.lat, h.lon, h.status, h.type,
				            json_build_object(
								'id', c.id,
					            'name', c.name
				            ) as country,
				            json_build_object(
								'id', r.id,
					            'name', r.name,
					            'country', json_build_object(
									'id', c.id,
						            'name', c.name
					                       )
				            ) AS region,
				            h.start_date, h.end_date,
				            (6371000 * acos(
								LEAST(1.0, GREATEST(-1.0,
					                                cos(radians(?)) * cos(radians(h.lat)) * cos(radians(h.lon) - radians(?)) +
					                                sin(radians(?)) * sin(radians(h.lat))
					                       ))
				                       )) AS distance_meters
				     FROM point_of_interest h
							  JOIN country c ON h.country_id = c.id
					          JOIN region r ON h.region_id = r.id
						 ${userJoinSql}
				     WHERE h.status = 'Published'
						 ${typeFilterSql}
					     ${visitedFilterSql}
				 ) AS spatial_search
			ORDER BY distanceMeters ASC
				LIMIT ?;
		`;

		const rawResults = (await this.execute(query, params)) as unknown as PointOfInterestRawRow[];

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
			type: site.type,
			organization: site.organization,
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
