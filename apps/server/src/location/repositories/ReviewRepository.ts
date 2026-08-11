import {EntityRepository} from '@mikro-orm/postgresql';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {Review, PointOfInterest} from '../../location';
import {User} from '../../user';

export class ReviewRepository extends EntityRepository<Review> {
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
		};
	}

	createReview(user: User, pointOfInterest: PointOfInterest, rating: ReviewRatingEnum, description: string) {
		const review = new Review({
			user,
			rating,
			description,
			pointOfInterest,
		});
		user.score += 10;

		this.em.persist([review, user]);

		return {
			id: review.id,
			rating: review.rating,
			description: review.description,
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
