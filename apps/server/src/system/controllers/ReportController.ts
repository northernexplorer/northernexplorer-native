import {
	ImageStatusEnum,
	Params,
	ReportStatusEnum,
	ReportType,
	ReportTypeEnum,
	Response,
	ReviewStatusEnum,
	RouteDefinition,
	ROUTES,
} from '@northernexplorer/types';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Report} from '../entities/Report';
import {Image} from '../../location/entities/Image';
import {config} from '../../config';

type Route<M extends keyof ROUTES['system']['ReportController']> = RouteDefinition<'system', 'ReportController'>[M];

export class ReportController extends BaseController {
	private permissionService = new PermissionService();
	private spacesManagementService = new SpacesManagementService({
		region: config.SPACES_REGION,
		defaultBucket: config.SPACES_BUCKET,
		spacesSecretKey: config.SPACES_SECRET_KEY,
		spacesAccessKey: config.SPACES_ACCESS_KEY,
	});

	constructor(repos: Repositories) {
		super(repos);
	}

	private async removeWithVariants(image: Image) {
		const originalKey = image.url.replace(/^\/+/, '');
		const dotIndex = originalKey.lastIndexOf('.');
		const basePath = dotIndex !== -1 ? originalKey.substring(0, dotIndex) : originalKey;

		const largeKey = `${basePath}_large.jpg`;
		const thumbnailKey = `${basePath}_thumbnail.jpg`;
		const coverKey = `${basePath}_cover.jpg`;

		await Promise.all([
			this.spacesManagementService.remove(originalKey).catch(() => null),
			image.processed ? this.spacesManagementService.remove(largeKey).catch(() => null) : Promise.resolve(),
			image.processed ? this.spacesManagementService.remove(thumbnailKey).catch(() => null) : Promise.resolve(),
			image.canBeCover ? this.spacesManagementService.remove(coverKey).catch(() => null) : Promise.resolve(),
		]);
	}

	private formatReport(report: Report): ReportType {
		return {
			id: report.id,
			version: report.version,
			type: report.type,
			reason: report.reason,
			description: report.description,
			status: report.status,
			user: {
				id: report.user.id,
				score: report.user.score,
				username: report.user.username,
				firstName: report.user.firstName,
				lastName: report.user.lastName,
			},
			review: report.review
				? {
						...report.review,
						likes: report.review.likes.length,
						user: {
							id: report.review.user.id,
							score: report.review.user.score,
							username: report.review.user.username,
							firstName: report.review.user.firstName,
							lastName: report.review.user.lastName,
						},
						pointOfInterest: {
							id: report.review.pointOfInterest.id,
							name: report.review.pointOfInterest.name,
						},
					}
				: undefined,
			image: report.image
				? {
						...report.image,
						likes: report.image.likes.length,
						user: {
							id: report.image.user.id,
							score: report.image.user.score,
							username: report.image.user.username,
							firstName: report.image.user.firstName,
							lastName: report.image.user.lastName,
						},
						pointOfInterest: {
							id: report.image.pointOfInterest.id,
							name: report.image.pointOfInterest.name,
							description: report.image.pointOfInterest.description,
							image: report.image.pointOfInterest.image,
							lat: report.image.pointOfInterest.lat,
							lon: report.image.pointOfInterest.lon,
							country: report.image.pointOfInterest.country,
							region: report.image.pointOfInterest.region,
						},
					}
				: undefined,
			createdAt: report.createdAt,
			updatedAt: report.updatedAt,
		};
	}

	async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);

		let review;
		let image;

		if (params.type === ReportTypeEnum.Review) {
			if (!params.reviewId) throw new Error('Review ID is required when reporting a review.');
			review = await this.repos.review.getById(params.reviewId);
		} else {
			if (!params.imageId) throw new Error('Image ID is required when reporting an image.');
			image = await this.repos.image.getById(params.imageId);
		}

		const report = new Report({
			type: params.type,
			reason: params.reason,
			description: params.description,
			user,
			review,
			image,
		});

		this.repos.report.persist(report);
		await this.flush();

		return {success: true, id: report.id};
	}

	async getAll(params: Params<Route<'getAll'>>, auth?: AuthContext): Promise<Response<Route<'getAll'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const reports = await this.repos.report.getAll({
			limit: params.limit,
			offset: params.offset,
			status: params.status,
		});

		return reports.map(report => this.formatReport(report));
	}

	async getById(params: Params<Route<'getById'>>, auth?: AuthContext): Promise<Response<Route<'getById'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const report = await this.repos.report.getById(params.id);
		return this.formatReport(report);
	}

	async resolve(params: Params<Route<'resolve'>>, auth?: AuthContext): Promise<Response<Route<'resolve'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const report = await this.repos.report.getById(params.id);
		report.status = ReportStatusEnum.Resolved;

		if (params.deleteContent) {
			if (report.type === ReportTypeEnum.Review && report.review) {
				const review = report.review;
				if (review.status === ReviewStatusEnum.Approved) {
					review.user.score = Math.max(0, review.user.score - 20);
				}
				this.repos.review.remove(review);
				await this.repos.pointOfInterest.updateSystemGeneratedDetails(review.pointOfInterest);
			} else if (report.type === ReportTypeEnum.Image && report.image) {
				const image = report.image;
				await this.removeWithVariants(image);
				if (image.status === ImageStatusEnum.Approved) {
					image.user.score = Math.max(0, image.user.score - 10);
				}
				image.user.score = Math.max(0, image.user.score - image.likes.length);
				this.repos.image.remove(image);
			}
		}

		await this.flush();
		return {success: true};
	}

	async dismiss(params: Params<Route<'dismiss'>>, auth?: AuthContext): Promise<Response<Route<'dismiss'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const report = await this.repos.report.getById(params.id);
		report.status = ReportStatusEnum.Dismissed;

		await this.flush();
		return {success: true};
	}

	async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const report = await this.repos.report.getById(params.id);
		this.repos.report.remove(report);

		await this.flush();
		return {success: true};
	}
}
