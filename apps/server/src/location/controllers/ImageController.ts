import {ImageStatusEnum, Params, Response, ReviewStatusEnum, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Image} from '../entities/Image';
import {SpacesManagementService} from '../services/SpacesManagementService';

type Route<M extends keyof ROUTES['location']['ImageController']> = RouteDefinition<'location', 'ImageController'>[M];

export class ImageController extends BaseController {
	private permissionService = new PermissionService();
	private spacesManagementService = new SpacesManagementService();

	constructor(repos: Repositories) {
		super(repos);
	}

	async upload(params: Params<Route<'upload'>>, auth?: AuthContext): Promise<Response<Route<'upload'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const pointOfInterest = await this.repos.pointOfInterest.findOneOrFail({id: params.pointOfInterestId});
		const user = await this.repos.user.getById(userId);
		const userReviewCount = await this.repos.review.count({user, status: ReviewStatusEnum.Approved});

		await Promise.all(
			params.files.map(async file => {
				const fileBuffer = Buffer.from(file.base64, 'base64');

				const url = this.repos.image.generateNewUrl({fileExtension: file.fileExtension});

				await this.spacesManagementService.upload({
					key: url,
					body: fileBuffer,
					contentType: file.mimeType,
					isPublic: true,
				});

				let status = ImageStatusEnum.Pending;
				if (userReviewCount >= 10 || user.score >= 500) {
					status = ImageStatusEnum.Approved;
					user.score = user.score + 10;
				}

				const image = new Image({
					fileExtension: file.fileExtension,
					filename: file.filename,
					mimeType: file.mimeType,
					size: file.size,
					url,
					status,
					altText: pointOfInterest.name,
					pointOfInterest,
					user,
				});

				this.repos.image.persist(image);
			}),
		);

		await this.flush();
		return {success: true};
	}

	async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		const image = await this.repos.image.getById(params.id);
		this.permissionService.canEditImage({targetId: image.user.id}, auth);

		await this.spacesManagementService.remove(image.url);

		if (image.status === ImageStatusEnum.Approved) {
			image.user.score = image.user.score - 10;
		}

		this.repos.image.remove(image);

		await this.flush();

		return {success: true};
	}

	async like(params: Params<Route<'like'>>, auth?: AuthContext): Promise<Response<Route<'like'>>> {
		this.permissionService.isLoggedIn(auth);
		const image = await this.repos.image.getById(params.id);

		image.likes = image.likes + 1;
		await this.flush();

		return {success: true};
	}

	async updateStatus(params: Params<Route<'updateStatus'>>): Promise<Response<Route<'updateStatus'>>> {
		const image = await this.repos.image.getById(params.id);

		image.status = params.status;
		await this.flush();

		return {success: true};
	}
}
