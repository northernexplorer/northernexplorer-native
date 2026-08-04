import {EntityRepository} from '@mikro-orm/postgresql';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {Review} from '../entities/ReviewEntity';
import { User,UserRepository } from '../../user';
import {HistoricSite, HistoricSiteRepository } from '../../location';
export class ReviewRepository extends EntityRepository<Review> {
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

	async createReview( userId: string,  historicSiteId: string, rating: ReviewRatingEnum,  description: string,) {
		const HistoricSiteRepository = this.em.getRepository(HistoricSite) as HistoricSiteRepository

		const UserRepository = this.em.getRepository(User) as UserRepository
	
		const user = await UserRepository.findOneOrFail({id:userId})
		const historicSite = await HistoricSiteRepository.findOneOrFail({id:historicSiteId})

		const review = new Review({
			user,
			rating,
			description,
			historicSite,
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
