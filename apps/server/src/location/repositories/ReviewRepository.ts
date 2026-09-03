import {EntranceCostEnum, ReviewRatingEnum, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';
import {Review, PointOfInterest} from '../../location';
import {BaseRepository} from '../../core/BaseRepository';
import {User} from '../../user';

export type CreateReviewParams = {
	user: User;
	pointOfInterest: PointOfInterest;
	rating: ReviewRatingEnum;
	description: string;
	difficulty: SiteDifficultyEnum;
	entranceCost: EntranceCostEnum;
	conditions: SiteConditionEnum[];
};

export class ReviewRepository extends BaseRepository<Review> {
	async getReviewsById(id: string) {
		const review = await this.findOneOrFail({id}, {populate: ['user', 'pointOfInterest']});

		return {
			id: review.id,
			user: {
				id: review.user.id,
				username: review.user.username,
				score: review.user.score,
			},
			pointOfInterest: {
				id: review.pointOfInterest.id,
				name: review.pointOfInterest.name,
			},
			rating: review.rating,
			description: review.description,
			difficulty: review.difficulty,
			entranceCost: review.entranceCost,
			conditions: review.conditions,
		};
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

	createReview({user, pointOfInterest, rating, description, difficulty, entranceCost, conditions}: CreateReviewParams) {
		const review = new Review({
			user,
			rating,
			description,
			pointOfInterest,
			difficulty,
			entranceCost,
			conditions,
		});
		user.score += 10;

		this.persist([review, user]);

		return {
			id: review.id,
			rating: review.rating,
			description: review.description,
			difficulty: review.difficulty,
			entranceCost: review.entranceCost,
			conditions: review.conditions,
			user: {
				id: user.id,
				name: user.username,
				score: user.score,
			},
			PointOfInterest: {
				id: pointOfInterest.id,
				name: pointOfInterest.name,
			},
		};
	}
}
