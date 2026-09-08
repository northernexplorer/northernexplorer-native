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

		if (params.files.length === 0) throw new Error('No files provided for upload.');

		const MAX_FILES = 10;
		if (params.files.length > MAX_FILES) throw new Error(`You can upload a maximum of ${MAX_FILES} photos at a time.`);

		const MAX_SINGLE_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per image
		const MAX_TOTAL_BATCH_BYTES = 50 * 1024 * 1024; // 50 MB total per payload

		let totalBatchSizeBytes = 0;

		for (const file of params.files) {
			if (file.size > MAX_SINGLE_FILE_BYTES) throw new Error(`File "${file.filename}" exceeds the maximum individual limit of 10 MB.`);
			totalBatchSizeBytes += file.size;
		}

		if (totalBatchSizeBytes > MAX_TOTAL_BATCH_BYTES) throw new Error('Total upload payload exceeds the 50 MB batch limit.');

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
		image.user.score = image.user.score + 1;
		await this.flush();

		return {success: true};
	}

	async unLike(params: Params<Route<'unLike'>>, auth?: AuthContext): Promise<Response<Route<'unLike'>>> {
		this.permissionService.isLoggedIn(auth);
		const image = await this.repos.image.getById(params.id);

		image.likes = image.likes - 1;
		image.user.score = image.user.score - 1;
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
