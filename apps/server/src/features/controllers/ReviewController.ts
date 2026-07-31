import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['features']['ReviewController']> = RouteDefinition<'features', 'ReviewController'>[M];

export class ReviewController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getReviewById(params: Params<Route<'getReviewById'>>): Promise<Response<Route<'getReviewById'>>> {
		const {id} = params;
		const review = this.repos.review.getReviewsById(id);

		await this.flush();
		return review;
	}

	public async createNewReview(params: Params<Route<'createNewReview'>>) {
		const {userId, historicSiteId, rating, description} = params;

		const review = await this.repos.review.createReview(userId, historicSiteId, rating, description);

		await this.flush();

		return review;
	}
}
