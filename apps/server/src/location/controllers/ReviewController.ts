import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../..';

type Route<M extends keyof ROUTES['location']['ReviewController']> = RouteDefinition<'location', 'ReviewController'>[M];

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

	public async createNewReview(params: Params<Route<'createNewReview'>>, auth?: AuthContext) {
		if (!auth?.userId) {
			throw new Error('You must be logged in');
		}

		if (auth.userId !== params.userId) {
			throw new Error('Unauthorized Request');
		}

		const {userId, historicSiteId, rating, description} = params;

		const review = await this.repos.review.createReview(userId, historicSiteId, rating, description);

		await this.flush();

		return review;
	}
}
