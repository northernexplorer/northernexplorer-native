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
		return this.findOneOrFail({id}, {populate: ['user', 'pointOfInterest', 'likes']});
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

		this.persist(review);

		return review;
	}
}
