import {BaseRepository} from '../../core/BaseRepository';
import {ReviewReply, ReviewReplyInput} from '../entities/ReviewReply';

export class ReviewReplyRepository extends BaseRepository<ReviewReply> {
	async getByReview(reviewId: string) {
		return this.find(
			{review: reviewId},
			{
				populate: ['user', 'parent'],
				orderBy: {createdAt: 'ASC'},
			},
		);
	}

	create(data: ReviewReplyInput) {
		const reply = new ReviewReply(data);
		this.persist(reply);
		return reply;
	}
}
