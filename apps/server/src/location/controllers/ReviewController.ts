import {Params, Response, ReviewStatusEnum, ReviewType, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {BaseController} from '../../core/BaseController';
import {Repositories} from '../../core/repositories';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {ReviewLike} from '../entities/ReviewLike';
import {Review} from '../entities/Review';

type Route<M extends keyof ROUTES['location']['ReviewController']> = RouteDefinition<'location', 'ReviewController'>[M];

export class ReviewController extends BaseController {
	private reviewResponse(review: Review): ReviewType {
		return {
			...review,
			likes: review.likes.length,
		};
	}

	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public async getReviewById(params: Params<Route<'getReviewById'>>): Promise<Response<Route<'getReviewById'>>> {
		const {id} = params;
		const review = await this.repos.review.getById(id);

		return this.reviewResponse(review);
	}

	async like(params: Params<Route<'like'>>, auth?: AuthContext): Promise<Response<Route<'like'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);

		const review = await this.repos.review.getById(params.id);

		const existingLike = await this.repos.reviewLike.findOne({
			review: review.id,
			user: userId,
		});

		if (existingLike) {
			return {success: true};
		}

		const newLike = new ReviewLike({
			review,
			user,
		});

		review.user.score = review.user.score + 1;

		this.persist(newLike);
		await this.flush();

		return {success: true};
	}

	async unLike(params: Params<Route<'unLike'>>, auth?: AuthContext): Promise<Response<Route<'unLike'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const existingLike = await this.repos.reviewLike.findOne({
			review: params.id,
			user: userId,
		});

		if (!existingLike) {
			return {success: true};
		}

		const review = await this.repos.review.getById(params.id);

		review.user.score = Math.max(0, review.user.score - 1);

		this.repos.reviewLike.remove(existingLike);
		await this.flush();

		return {success: true};
	}

	async hasLiked(params: Params<Route<'hasLiked'>>, auth?: AuthContext): Promise<Response<Route<'hasLiked'>>> {
		if (!auth?.userId) return {liked: false, likeCount: 0};

		const like = await this.repos.reviewLike.findLike(params.id, auth.userId);
		const review = await this.repos.review.getById(params.id);
		return {liked: Boolean(like), likeCount: review.likes.length};
	}

	public async getPendingReviews(params: Params<Route<'getPendingReviews'>>, auth?: AuthContext): Promise<Response<Route<'getPendingReviews'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const reviews = await this.repos.review.getPendingReviews({offset: params.offset, limit: params.limit});

		return reviews.map(review => ({
			...review,
			likes: review.likes.length,
		}));
	}

	public async approveReview(params: Params<Route<'approveReview'>>, auth?: AuthContext): Promise<Response<Route<'approveReview'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const review = await this.repos.review.getById(id);

		review.status = ReviewStatusEnum.Approved;
		review.user.score = review.user.score + 20;

		await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
		await this.flush();

		return this.reviewResponse(review);
	}

	public async rejectReview(params: Params<Route<'rejectReview'>>, auth?: AuthContext): Promise<Response<Route<'rejectReview'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const review = await this.repos.review.getById(id);

		this.repos.review.remove(review);
		await this.flush();

		return {success: true};
	}

	public async deleteReview(params: Params<Route<'deleteReview'>>, auth?: AuthContext): Promise<Response<Route<'deleteReview'>>> {
		const review = await this.repos.review.getById(params.id);
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canEditReview({targetId: review.user.id}, auth);

		// Deduct points if deleting an approved review
		if (review.status === ReviewStatusEnum.Approved) {
			review.user.score = review.user.score - 20;
		}

		this.repos.review.remove(review);

		await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
		await this.flush();

		return {success: true};
	}

	public async createNewReview(params: Params<Route<'createNewReview'>>, auth?: AuthContext): Promise<Response<Route<'createNewReview'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const {pointOfInterestId, rating, description, difficulty, entranceCost, conditions} = params;

		const user = await this.repos.user.getById(userId);
		const pointOfInterest = await this.repos.pointOfInterest.getById(pointOfInterestId);

		let status = ReviewStatusEnum.Pending;
		if (this.repos.user.isPostApproved(user)) {
			user.score = user.score + 20;
			status = ReviewStatusEnum.Approved;
		}

		const review = this.repos.review.createReview({
			user,
			pointOfInterest,
			rating,
			description,
			difficulty,
			entranceCost,
			conditions,
			status,
		});

		await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
		await this.flush();

		return {
			...review,
			likes: 0,
			user: {id: user.id, score: user.score, username: user.username, firstName: user.firstName, lastName: user.lastName},
		};
	}

	public async editReview(params: Params<Route<'editReview'>>, auth?: AuthContext): Promise<Response<Route<'editReview'>>> {
		const review = await this.repos.review.getById(params.id);
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canEditReview({targetId: review.user.id}, auth);

		review.rating = params.rating;
		review.description = params.description;
		review.difficulty = params.difficulty;
		review.entranceCost = params.entranceCost;
		review.conditions = params.conditions;

		const user = review.user;

		await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
		await this.flush();

		return {
			...review,
			likes: review.likes.length,
			user: {
				id: user.id,
				score: user.score,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		};
	}
}
