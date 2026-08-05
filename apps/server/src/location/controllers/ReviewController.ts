import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../..';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['location']['ReviewController']> = RouteDefinition<'location', 'ReviewController'>[M];

export class ReviewController extends BaseController {
	private permissionService = new PermissionService();

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
		const {userId} = this.permissionService.isLoggedIn(auth);

		const {historicSiteId, rating, description} = params;

		const user = await this.repos.user.getById(userId);
		const historicSite = await this.repos.historicSite.getById(historicSiteId);

		const review = this.repos.review.createReview(user, historicSite, rating, description);

		await this.flush();

		return review;
	}
}
