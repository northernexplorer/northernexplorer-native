import {ImageStatusEnum, Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
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

				const image = new Image({
					fileExtension: file.fileExtension,
					filename: file.filename,
					mimeType: file.mimeType,
					size: file.size,
					url,
					status: ImageStatusEnum.Pending,
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

	async deleteById(params: Params<Route<'deleteById'>>): Promise<Response<Route<'deleteById'>>> {
		const image = await this.repos.image.getById(params.id);

		await this.spacesManagementService.remove(image.url);

		this.repos.image.remove(image);
		await this.flush();

		return {success: true};
	}

	async like(params: Params<Route<'like'>>): Promise<Response<Route<'like'>>> {
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
