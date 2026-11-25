import {
	Params,
	PublishStatusEnum,
	Response,
	ReviewReplyType,
	ReviewStatusEnum,
	ReviewType,
	RolesEnum,
	RouteDefinition,
	ROUTES,
} from '@northernexplorer/types';
import {BaseController} from '../../core/BaseController';
import {Repositories} from '../../core/repositories';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Notification} from '../../system/entities/Notification';
import {ReviewLike} from '../entities/ReviewLike';
import {Review} from '../entities/Review';
import {ReviewReply} from '../entities/ReviewReply';

type Route<M extends keyof ROUTES['location']['ReviewController']> = RouteDefinition<'location', 'ReviewController'>[M];
const MAX_REPLY_LENGTH = 2000;
const MAX_REPLY_DEPTH = 3;

function urlSlug(value: string) {
	return (
		value
			.toLowerCase()
			.trim()
			.replace(/[\s_/]+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '') || 'location'
	);
}

export class ReviewController extends BaseController {
	private reviewResponse(review: Review): ReviewType {
		return {
			...review,
			likes: review.likes.length,
		};
	}

	private replyResponse(reply: ReviewReply): ReviewReplyType {
		const user = reply.user;
		return {
			id: reply.id,
			text: reply.text,
			parentId: reply.parent?.id ?? null,
			depth: reply.depth,
			createdAt: reply.createdAt.toISOString(),
			user: {
				id: user.id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				score: user.score,
			},
		};
	}

	private ensureThreadAccess(review: Review, auth?: AuthContext) {
		if (review.status === ReviewStatusEnum.Approved && review.pointOfInterest.status === PublishStatusEnum.Published) {
			return;
		}

		const {userId} = this.permissionService.isLoggedIn(auth);
		if (userId !== review.user.id && !auth?.roles?.includes(RolesEnum.Admin)) {
			throw new Error("You don't have permission to view this review.");
		}
	}

	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const {id} = params;
		const review = await this.repos.review.getById(id);

		return this.reviewResponse(review);
	}

	public async getReplies(params: Params<Route<'getReplies'>>, auth?: AuthContext): Promise<Response<Route<'getReplies'>>> {
		const review = await this.repos.review.getById(params.reviewId);
		this.ensureThreadAccess(review, auth);
		const replies = await this.repos.reviewReply.getByReview(review.id);
		return replies.map(reply => this.replyResponse(reply));
	}

	public async createReply(params: Params<Route<'createReply'>>, auth?: AuthContext): Promise<Response<Route<'createReply'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const review = await this.repos.review.getById(params.reviewId);
		this.ensureThreadAccess(review, auth);

		if (typeof params.text !== 'string') {
			throw new Error('Reply text is required.');
		}
		const text = params.text.trim();
		if (!text) {
			throw new Error('Reply text is required.');
		}
		if (text.length > MAX_REPLY_LENGTH) {
			throw new Error(`Reply text cannot exceed ${MAX_REPLY_LENGTH} characters.`);
		}

		let parent: ReviewReply | null = null;
		let depth = 1;
		if (params.parentId) {
			parent = await this.repos.reviewReply.findOne({id: params.parentId, review: review.id});
			if (!parent) {
				throw new Error('Reply parent does not belong to this review.');
			}
			if (parent.depth >= MAX_REPLY_DEPTH) {
				throw new Error(`Replies can only be nested ${MAX_REPLY_DEPTH} comments deep.`);
			}
			depth = parent.depth + 1;
		}

		const site =
			userId !== review.user.id
				? await this.repos.pointOfInterest.findOneOrFail({id: review.pointOfInterest.id}, {populate: ['country', 'region']})
				: null;
		const user = await this.repos.user.getById(userId);
		const reply = this.repos.reviewReply.create({review, user, text, parent, depth});
		if (site) {
			const path = `/${urlSlug(site.country.name)}/${urlSlug(site.region.name)}/${urlSlug(site.name)}/${site.id}`;
			const query = new URLSearchParams({reviewId: review.id, replyId: reply.id});
			const notification = new Notification({
				user: review.user,
				title: 'New reply to your review',
				message: `${user.username} replied to your review.`,
				link: `${path}?${query}`,
			});
			this.persist(notification);
		}
		await this.flush();
		return this.replyResponse(reply);
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
		const [like, likeCount] = await Promise.all([
			auth?.userId ? this.repos.reviewLike.findLike(params.id, auth.userId) : null,
			this.repos.reviewLike.countLikes(params.id),
		]);
		return {liked: Boolean(like), likeCount};
	}

	public async getPending(params: Params<Route<'getPending'>>, auth?: AuthContext): Promise<Response<Route<'getPending'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const reviews = await this.repos.review.getPending({offset: params.offset, limit: params.limit});

		return reviews.map(review => ({
			...review,
			likes: review.likes.length,
		}));
	}

	public async getPendingPaginated(
		params: Params<Route<'getPendingPaginated'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getPendingPaginated'>>> {
		const items = await this.getPending(params, auth);
		const totalCount = await this.repos.review.count({status: ReviewStatusEnum.Pending});
		return {items, totalCount};
	}

	public async approve(params: Params<Route<'approve'>>, auth?: AuthContext): Promise<Response<Route<'approve'>>> {
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

	public async reject(params: Params<Route<'reject'>>, auth?: AuthContext): Promise<Response<Route<'reject'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const review = await this.repos.review.getById(id);

		this.repos.review.remove(review);
		await this.flush();

		return {success: true};
	}

	public async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		const review = await this.repos.review.getById(params.id);
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canEdit({targetId: review.user.id}, auth);

		// Deduct points if deleting an approved review
		if (review.status === ReviewStatusEnum.Approved) {
			review.user.score = review.user.score - 20;
		}

		this.repos.review.remove(review);

		await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
		await this.flush();

		return {success: true};
	}

	public async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const {pointOfInterestId, rating, description, difficulty, entranceCost, conditions} = params;

		const user = await this.repos.user.getById(userId);
		const pointOfInterest = await this.repos.pointOfInterest.getById(pointOfInterestId);

		let status = ReviewStatusEnum.Pending;
		if (pointOfInterest.status !== PublishStatusEnum.Draft && this.repos.user.isPostApproved(user)) {
			user.score = user.score + 20;
			status = ReviewStatusEnum.Approved;
		}

		const review = this.repos.review.create({
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

	public async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		const review = await this.repos.review.getById(params.id);
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canEdit({targetId: review.user.id}, auth);

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
