import {EntityRepository} from '@mikro-orm/postgresql';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {Review} from '../entities/ReviewEntity';
import {User} from '../../user';
import {HistoricSite} from '../../location';

export class ReviewRepository extends EntityRepository<Review> {
	async getReviewsById(id: string) {
		const review = await this.em.findOneOrFail(Review, {id: id}, {populate: ['user', 'historicSite']});

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

	async createReview(userId: string, HistoricSiteId: string, rating: ReviewRatingEnum, description: string) {
		const user = await this.em.findOneOrFail(User, userId);

		const historicSite = await this.em.findOneOrFail(HistoricSite, HistoricSiteId);

		const review = this.em.create(Review, {
			user,
			rating,
			description,
			historicSite,
			version: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		user.score += 10;

		this.em.persist([review, user]);
		await this.em.flush();

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
