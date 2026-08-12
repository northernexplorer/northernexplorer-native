import {ReviewRatingEnum} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Review, HistoricSite} from '../../location';
import {User} from '../../user';

export class ReviewRepository extends BaseRepository<Review> {
	async getReviewsById(id: string) {
		const review = await this.findOneOrFail({id}, {populate: ['user', 'historicSite']});

		return {
			id: review.id,
			user: {
				id: review.user.id,
				username: review.user.username,
				score: review.user.score,
			},
			historicSite: {
				id: review.historicSite.id,
				name: review.historicSite.name,
			},
			rating: review.rating,
			description: review.description,
		};
	}

	createReview(user: User, historicSite: HistoricSite, rating: ReviewRatingEnum, description: string) {
		const review = new Review({
			user,
			rating,
			description,
			historicSite,
		});
		user.score += 10;

		this.persist([review, user]);

		return {
			id: review.id,
			rating: review.rating,
			description: review.description,
			user: {
				id: user.id,
				name: user.username,
				score: user.score,
			},
			HistoricSite: {
				id: historicSite.id,
				name: historicSite.name,
			},
		};
	}
}
