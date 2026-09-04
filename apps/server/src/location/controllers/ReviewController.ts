import {Params, Response, ReviewStatusEnum, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {BaseController} from '../../core/BaseController';
import {Repositories} from '../../core/repositories';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['location']['ReviewController']> = RouteDefinition<'location', 'ReviewController'>[M];

export class ReviewController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public async getReviewById(params: Params<Route<'getReviewById'>>): Promise<Response<Route<'getReviewById'>>> {
		const {id} = params;
		const review = await this.repos.review.getById(id);

		return review;
	}

	public async getPendingReviews(_params: Params<Route<'getPendingReviews'>>, auth?: AuthContext): Promise<Response<Route<'getPendingReviews'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		return this.repos.review.find({status: ReviewStatusEnum.Pending}, {populate: ['user', 'pointOfInterest']});
	}

	public async approveReview(params: Params<Route<'approveReview'>>, auth?: AuthContext): Promise<Response<Route<'approveReview'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const review = await this.repos.review.getById(id);

		review.status = ReviewStatusEnum.Approved;
		review.user.score = review.user.score + 10;

		await this.flush();

		return review;
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
		if (review.status === ReviewStatusEnum.Approved && review.user.score >= 10) {
			review.user.score = review.user.score - 10;
		}

		this.repos.review.remove(review);
		await this.flush();

		return {success: true};
	}

	public async createNewReview(params: Params<Route<'createNewReview'>>, auth?: AuthContext): Promise<Response<Route<'createNewReview'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const {pointOfInterestId, rating, description, difficulty, entranceCost, conditions} = params;

		const user = await this.repos.user.getById(userId);
		const pointOfInterest = await this.repos.pointOfInterest.getById(pointOfInterestId);
		const userReviewCount = await this.repos.review.count({user, status: ReviewStatusEnum.Approved});

		let status = ReviewStatusEnum.Pending;
		if (userReviewCount >= 10 || user.score >= 500) {
			status = ReviewStatusEnum.Approved;
			user.score = user.score + 10;
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

		await this.flush();

		return {...review, user: {id: user.id, score: user.score, username: user.username, firstName: user.firstName, lastName: user.lastName}};
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

		await this.flush();

		return {
			...review,
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
