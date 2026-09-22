import {
	CountryType,
	EntranceCostEnum,
	ImageStatusEnum,
	OrganizationType,
	PointOfInterestType,
	PointOfInterestTypeEnum,
	PublishStatusEnum,
	RegionType,
	ReviewStatusEnum,
	SiteConditionEnum,
	SiteDifficultyEnum,
	VisitedFilterEnum,
} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {PointOfInterest} from '../entities/PointOfInterest';
import {User} from '../../user';
import {Image} from '../entities/Image';

interface PointOfInterestRawRow {
	id: string;
	name: string;
	description: string;
	image: PointOfInterestType['image'];
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
	entranceCost?: EntranceCostEnum;
	difficulty?: string;
	rating?: number | string;
	reviews?: {id: string; rating: number}[];
}

export interface GetClosestPoisOptions {
	lat: number;
	lon: number;
	limit: number;
	showDrafts?: boolean;
	userId?: string;
	selectedPoiTypes?: PointOfInterestTypeEnum[];
	visitedFilter?: VisitedFilterEnum;
	minRating?: number | null;
	maxDifficultyIndex?: number;
	maxCostIndex?: number;
}

export class PointOfInterestRepository extends BaseRepository<PointOfInterest> {
	async getPointOfInterestById(id: string, currentUserId?: string): Promise<PointOfInterestType> {
		const site = await this.findOneOrFail(
			{id},
			{populate: ['country', 'region', 'reviews', 'reviews.user', 'organization', 'images', 'images.user', 'images.likes', 'image']},
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

	async getClosestPointOfInterests({
		lat,
		lon,
		limit,
		showDrafts = false,
		userId,
		selectedPoiTypes = [],
		visitedFilter = VisitedFilterEnum.All,
		minRating,
		maxDifficultyIndex,
		maxCostIndex,
	}: GetClosestPoisOptions): Promise<PointOfInterestType[]> {
		const params: unknown[] = [];

		// 1. Haversine SELECT parameters
		params.push(lat, lon, lat);

		// 2. JOIN parameters
		const applyVisitedFilter = Boolean(userId) && visitedFilter !== VisitedFilterEnum.All;
		let userJoinSql = '';
		let visitedFilterSql = '';

		if (applyVisitedFilter) {
			userJoinSql = `
    LEFT JOIN review rev_filter 
       ON rev_filter.point_of_interest_id = h.id 
       AND rev_filter.user_id = ?
 `;
			params.push(userId);

			if (visitedFilter === VisitedFilterEnum.Visited) {
				visitedFilterSql = `AND rev_filter.id IS NOT NULL`;
			} else {
				visitedFilterSql = `AND rev_filter.id IS NULL`;
			}
		}

		// 3. WHERE clause parameters
		const isDraftsEnabled = showDrafts === true || (showDrafts as unknown) === 'true';

		const allowedStatuses = isDraftsEnabled ? ['Published', 'Draft'] : ['Published'];
		const statusPlaceholders = allowedStatuses.map(() => '?').join(', ');
		const statusFilterSql = `AND h.status IN (${statusPlaceholders})`;
		params.push(...allowedStatuses);

		const hasTypeFilter = selectedPoiTypes.length > 0;
		let typeFilterSql = '';
		if (hasTypeFilter) {
			const typePlaceholders = selectedPoiTypes.map(() => '?').join(', ');
			typeFilterSql = `AND h.type && ARRAY[${typePlaceholders}]::text[]`;
			params.push(...selectedPoiTypes);
		}

		let difficultyFilterSql = '';
		if (maxDifficultyIndex !== undefined) {
			const orderedDifficulties = [
				SiteDifficultyEnum.DEVELOPED,
				SiteDifficultyEnum.LIGHT_HIKE,
				SiteDifficultyEnum.MODERATE_TRAIL,
				SiteDifficultyEnum.OFF_TRAIL_REMOTE,
				SiteDifficultyEnum.EXPEDITION_ONLY,
			];
			const allowedDifficulties = orderedDifficulties.slice(0, maxDifficultyIndex + 1);
			if (allowedDifficulties.length > 0) {
				const diffPlaceholders = allowedDifficulties.map(() => '?').join(', ');
				difficultyFilterSql = `AND (h.difficulty IN (${diffPlaceholders}) OR h.difficulty IS NULL)`;
				params.push(...allowedDifficulties);
			}
		}

		let costFilterSql = '';
		if (maxCostIndex !== undefined) {
			const orderedCosts = [
				EntranceCostEnum.FREE,
				EntranceCostEnum.TIER_1_10,
				EntranceCostEnum.TIER_11_25,
				EntranceCostEnum.TIER_26_50,
				EntranceCostEnum.TIER_50_PLUS,
			];
			const allowedCosts = orderedCosts.slice(0, maxCostIndex + 1);
			if (allowedCosts.length > 0) {
				const costPlaceholders = allowedCosts.map(() => '?').join(', ');
				costFilterSql = `AND (h.entrance_cost IN (${costPlaceholders}) OR h.entrance_cost IS NULL)`;
				params.push(...allowedCosts);
			}
		}

		// 4. HAVING clause parameter
		let minRatingSql = '';
		if (minRating !== null && minRating !== undefined) {
			minRatingSql = `HAVING COALESCE(AVG(rev.rating), 0) >= ?`;
			params.push(minRating);
		}

		// 5. Outer LIMIT parameter
		params.push(limit);

		const query = `
			SELECT id, name, description, image, lat, lon, country, region, status, type,
				   difficulty, entrance_cost as "entranceCost", rating, reviews,
				   start_date as "startDate", end_date as "endDate", distance_meters as distanceMeters
			FROM (
					 SELECT h.id, h.name, h.description, h.lat, h.lon, h.status, h.type,
							h.difficulty, h.entrance_cost,
							CASE WHEN img.id IS NOT NULL THEN
									 json_build_object(
										 'id', img.id,
										 'version', img.version,
										 'url', img.url,
										 'fileExtension', img.file_extension,
										 'filename', img.filename,
										 'mimeType', img.mime_type,
										 'size', img.size,
										 'altText', img.alt_text,
										 'processed', img.processed,
										 'createdAt', img.created_at,
										 'status', img.status
									 )
								 ELSE NULL END AS image,
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
							  LEFT JOIN image img ON h.image_id = img.id
							  LEFT JOIN review rev ON rev.point_of_interest_id = h.id
						 ${userJoinSql}
					 WHERE 1=1
						 ${statusFilterSql}
						 ${typeFilterSql}
						 ${visitedFilterSql}
						 ${difficultyFilterSql}
						 ${costFilterSql}
					 GROUP BY h.id, h.status, c.id, r.id, img.id
						 ${minRatingSql}
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
			entranceCost: site.entranceCost,
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

	getDrafts({limit, offset}: {limit?: number; offset?: number}) {
		return this.find(
			{status: PublishStatusEnum.Draft},
			{
				limit,
				offset,
				orderBy: {createdAt: 'asc', name: 'asc'},
				populate: ['region', 'country', 'image'],
			},
		);
	}

	getPublished({limit, offset}: {limit?: number; offset?: number}) {
		return this.find(
			{status: PublishStatusEnum.Published},
			{
				limit,
				offset,
				orderBy: {name: 'asc'},
				populate: ['region', 'country', 'image'],
			},
		);
	}

	getVisitedByUser(user: User) {
		return this.find({reviews: {user}}, {populate: ['reviews', 'region', 'country']});
	}

	async updateSystemGeneratedDetails(pointOfInterestRef: PointOfInterest | string): Promise<PointOfInterest> {
		// Fetch entity without pre-loading the entire reviews collection
		const pointOfInterest = typeof pointOfInterestRef === 'string' ? await this.findOneOrFail(pointOfInterestRef) : pointOfInterestRef;

		// Query only approved reviews directly from the database
		const approvedReviews = await pointOfInterest.reviews.matching({
			where: {status: ReviewStatusEnum.Approved},
		});

		// Handle zero-review reset edge case
		if (approvedReviews.length === 0) {
			pointOfInterest.rating = undefined;
			pointOfInterest.difficulty = undefined;
			pointOfInterest.entranceCost = undefined;
			pointOfInterest.conditions = undefined;
			pointOfInterest.updatedAt = new Date();
			return pointOfInterest;
		}

		// Calculate average rating
		const totalRating = approvedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
		pointOfInterest.rating = Math.round(totalRating / approvedReviews.length);

		// Find mode for difficulty & entrance cost
		pointOfInterest.difficulty = this.getMode(approvedReviews.map(r => r.difficulty));

		pointOfInterest.entranceCost = this.getMode(approvedReviews.map(r => r.entranceCost));

		// Aggregate conditions while filtering out outliers
		const conditionCounts = new Map<SiteConditionEnum, number>();

		for (const review of approvedReviews) {
			for (const condition of new Set(review.conditions)) {
				conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
			}
		}

		const minOccurrences = approvedReviews.length < 5 ? 1 : Math.ceil(approvedReviews.length * 0.2);

		const validConditions = Array.from(conditionCounts.entries())
			.filter(([, count]) => count >= minOccurrences)
			.map(([condition]) => condition);

		pointOfInterest.conditions = validConditions.length > 0 ? validConditions : undefined;
		pointOfInterest.updatedAt = new Date();

		return pointOfInterest;
	}

	async setCoverImage(image: Image) {
		if (!image.likes.isInitialized()) {
			await image.likes.init();
		}

		const pointOfInterest = await this.findOneOrFail(image.pointOfInterest.id, {populate: ['image', 'image.likes']});

		const currentLikesCount = pointOfInterest.image.likes.length;
		const candidateLikesCount = image.likes.length;

		console.log(image.pointOfInterest.id);
		console.log(currentLikesCount);
		console.log(candidateLikesCount);
		if (candidateLikesCount > currentLikesCount) {
			// @ts-expect-error errors due to a mikro-orm type definition
			pointOfInterest.image = image;
		}
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
