import {EntranceCostEnum, ReviewRatingEnum, ReviewStatusEnum, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {User} from '../../user';
import {PointOfInterest, Review} from '../../location';

export type CreateReviewParams = {
	user: User;
	pointOfInterest: PointOfInterest;
	rating: ReviewRatingEnum;
	description: string;
	difficulty: SiteDifficultyEnum;
	entranceCost: EntranceCostEnum;
	conditions: SiteConditionEnum[];
	status: ReviewStatusEnum;
};

export class ReviewRepository extends BaseRepository<Review> {
	async getById(id: string) {
		return this.findOneOrFail({id}, {populate: ['user', 'pointOfInterest']});
	}

	async getAverageRatingByPointOfInterestId(pointOfInterestId: string): Promise<number> {
		const result = await this.execute<{avg_rating: string | number | null}[]>(
			`SELECT AVG(rating) as avg_rating FROM review WHERE point_of_interest_id = ?`,
			[pointOfInterestId],
		);

		const rawAvg = result[0]?.avg_rating;
		if (!rawAvg) {
			return 0;
		}

		const numericAvg = typeof rawAvg === 'number' ? rawAvg : parseFloat(rawAvg);
		return isNaN(numericAvg) ? 0 : Math.round(numericAvg * 10) / 10;
	}

	createReview({user, pointOfInterest, rating, description, difficulty, entranceCost, conditions, status}: CreateReviewParams) {
		const review = new Review({
			user,
			rating,
			description,
			pointOfInterest,
			difficulty,
			entranceCost,
			conditions,
			status,
		});

		this.persist([review]);

		return {
			id: review.id,
			rating: review.rating,
			description: review.description,
			difficulty: review.difficulty,
			entranceCost: review.entranceCost,
			conditions: review.conditions,
			status: review.status,
			user: {
				id: user.id,
				username: user.username,
				score: user.score,
			},
			pointOfInterest: {
				id: pointOfInterest.id,
				name: pointOfInterest.name,
			},
		};
	}
}
