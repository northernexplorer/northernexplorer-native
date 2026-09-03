import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
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
		const review = await this.repos.review.getReviewsById(id);

		await this.flush();
		return review;
	}

	public async createNewReview(params: Params<Route<'createNewReview'>>, auth?: AuthContext) {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const {pointOfInterestId, rating, description, difficulty, entranceCost, conditions} = params;

		const user = await this.repos.user.getById(userId);
		const pointOfInterest = await this.repos.pointOfInterest.getById(pointOfInterestId);

		const review = this.repos.review.createReview({
			user,
			pointOfInterest,
			rating,
			description,
			difficulty,
			entranceCost,
			conditions,
		});

		await this.flush();

		return review;
	}
}
