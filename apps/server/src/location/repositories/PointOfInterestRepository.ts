import {
	CountryType,
	ImageStatusEnum,
	OrganizationType,
	PointOfInterestType,
	PointOfInterestTypeEnum,
	PublishStatusEnum,
	RegionType,
	ReviewStatusEnum,
	SiteConditionEnum,
	VisitedFilterEnum,
} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {PointOfInterest} from '../entities/PointOfInterest';
import {User} from '../../user';

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
	distanceMeters: number;
	status: PublishStatusEnum;
	type: PointOfInterestTypeEnum[];
	organization: OrganizationType;
	difficulty?: string;
	rating?: number | string;
	reviews?: {id: string; rating: number}[];
}

export class PointOfInterestRepository extends BaseRepository<PointOfInterest> {
	async getPointOfInterestById(id: string, currentUserId?: string): Promise<PointOfInterestType> {
		const site = await this.findOneOrFail(
			{id},
			{populate: ['country', 'region', 'reviews', 'reviews.user', 'organization', 'images', 'images.user', 'images.likes']},
		);

		// Filter reviews: show published reviews OR reviews belonging to the current user
		const visibleReviews = site.reviews.filter(review => review.status === ReviewStatusEnum.Approved || review.user.id === currentUserId);
		// Filter images: show published images OR images belonging to the current user
		const visibleImages = site.images.filter(image => image.status === ImageStatusEnum.Approved || image.user.id === currentUserId);

		return {
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			lat: site.lat,
			lon: site.lon,
			startDate: site.startDate,
			endDate: site.endDate,
			rating: site.rating,
			difficulty: site.difficulty,
			entranceCost: site.entranceCost,
			conditions: site.conditions,
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
			images: visibleImages.map(image => ({
				id: image.id,
				version: image.version,
				url: image.url,
				fileExtension: image.fileExtension,
				filename: image.filename,
				mimeType: image.mimeType,
				size: image.size,
				likes: image.likes.length,
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
	): Promise<PointOfInterestType[]> {
		const params: unknown[] = [];

		const applyVisitedFilter = Boolean(userId) && visitedFilter !== VisitedFilterEnum.All;

		let userJoinSql = '';
		let visitedFilterSql = '';

		if (applyVisitedFilter) {
			userJoinSql = `
          LEFT JOIN review rev_filter 
            ON rev_filter.point_of_interest_id = h.id 
           AND rev_filter.user_id = ?
      `;

			if (visitedFilter === VisitedFilterEnum.Visited) {
				visitedFilterSql = `AND rev_filter.id IS NOT NULL`;
			} else {
				visitedFilterSql = `AND rev_filter.id IS NULL`;
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
				   difficulty, rating, reviews,
				   start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
			FROM (
					 SELECT h.id, h.name, h.description, h.image, h.lat, h.lon, h.status, h.type,
							h.difficulty,
							COALESCE(AVG(rev.rating), 0) as rating,
							COALESCE(
								json_agg(
									json_build_object('id', rev.id, 'rating', rev.rating)
								) FILTER (WHERE rev.id IS NOT NULL),
								'[]'
							) as reviews,
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
							  LEFT JOIN review rev ON rev.point_of_interest_id = h.id
						 ${userJoinSql}
					 WHERE h.status = 'Published'
						 ${typeFilterSql}
						 ${visitedFilterSql}
					 GROUP BY h.id, c.id, r.id
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
			rating: site.rating,
			difficulty: site.difficulty,
			reviews: site.reviews ?? [],
			lat: Number(site.lat),
			lon: Number(site.lon),
			startDate: site.startDate ? Number(site.startDate) : undefined,
			endDate: site.endDate ? Number(site.endDate) : undefined,
			status: site.status,
			type: site.type,
			organization: site.organization,
		})) as PointOfInterestType[];
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

	getVisitedByUser(user: User) {
		return this.find({reviews: {user}}, {populate: ['reviews', 'region', 'country']});
	}

	async updateSystemGeneratedDetails(pointOfInterestRef: PointOfInterest | string) {
		const pointOfInterest =
			typeof pointOfInterestRef === 'string'
				? await this.findOneOrFail(pointOfInterestRef, {populate: ['reviews']})
				: await this.populate(pointOfInterestRef, ['reviews']);

		const reviews = pointOfInterest.reviews.getItems();
		// Calculate average rating (rounded to nearest enum/integer value)
		const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
		pointOfInterest.rating = Math.round(totalRating / reviews.length);

		// Find most frequent (mode) difficulty
		pointOfInterest.difficulty = this.getMode(reviews.map(r => r.difficulty));

		// Find most frequent (mode) entrance cost
		pointOfInterest.entranceCost = this.getMode(reviews.map(r => r.entranceCost));

		// Aggregate conditions while filtering out outliers
		const conditionCounts = new Map<SiteConditionEnum, number>();
		for (const review of reviews) {
			const uniqueReviewConditions = new Set(review.conditions);
			for (const condition of uniqueReviewConditions) {
				conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
			}
		}

		// Define threshold: must appear in at least 20% of reviews (minimum of 1 if few reviews)
		const minOccurrences = reviews.length < 5 ? 1 : Math.ceil(reviews.length * 0.2);

		const validConditions = Array.from(conditionCounts.entries())
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, count]) => count >= minOccurrences)
			.map(([condition]) => condition);

		pointOfInterest.conditions = validConditions.length > 0 ? validConditions : undefined;

		pointOfInterest.updatedAt = new Date();
	}

	private getMode<T>(arr: T[]): T | undefined {
		if (arr.length === 0) return undefined;
		const frequency: Record<string, number> = {};
		let maxFreq = 0;
		let mode: T = arr[0];

		for (const item of arr) {
			if (item === undefined || item === null) continue;
			const key = String(item);
			frequency[key] = (frequency[key] || 0) + 1;
			if (frequency[key] > maxFreq) {
				maxFreq = frequency[key];
				mode = item;
			}
		}
		return maxFreq > 0 ? mode : undefined;
	}
}
