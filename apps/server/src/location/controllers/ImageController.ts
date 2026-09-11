import {createHash} from 'node:crypto';
import {ImageStatusEnum, ImageUploadStatus, Params, Response, ReviewStatusEnum, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Image} from '../entities/Image';
import {SpacesManagementService} from '../../../../../packages/tools/src/services/SpacesManagementService';
import {ImageLike} from '../entities/ImageLike';

type Route<M extends keyof ROUTES['location']['ImageController']> = RouteDefinition<'location', 'ImageController'>[M];

export class ImageController extends BaseController {
	private permissionService = new PermissionService();
	private spacesManagementService = new SpacesManagementService();

	constructor(repos: Repositories) {
		super(repos);
	}

	async topImages(): Promise<Response<Route<'topImages'>>> {
		const images = await this.repos.image.topImages();

		return images.map(image => ({
			...image,
			likes: image.likes.length,
			user: {
				id: image.user.id,
				username: image.user.username,
				firstName: image.user.firstName,
				lastName: image.user.lastName,
				score: image.user.score,
			},
			pointOfInterest: {
				id: image.pointOfInterest.id,
				name: image.pointOfInterest.name,
				description: image.pointOfInterest.description,
				image: image.pointOfInterest.image,
				lat: image.pointOfInterest.lat,
				lon: image.pointOfInterest.lon,
				country: image.pointOfInterest.country,
				region: image.pointOfInterest.region,
			},
		}));
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

		const results: {file: string; status: ImageUploadStatus}[] = [];

		await Promise.all(
			params.files.map(async file => {
				const fileBuffer = Buffer.from(file.base64, 'base64');
				const hash = createHash('sha256').update(fileBuffer).digest('hex');
				const isDuplicate = await this.repos.image.getDuplicate(hash, user);
				if (isDuplicate) {
					results.push({file: file.uri, status: ImageUploadStatus.Duplicate});
					return;
				}

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
					hash,
				});

				this.repos.image.persist(image);
				results.push({file: file.uri, status: ImageUploadStatus.Success});
			}),
		);

		const successCount = results.filter(r => r.status === ImageUploadStatus.Success).length;
		if ((userReviewCount >= 10 || user.score >= 500) && successCount > 0) {
			user.score += successCount * 10;
		}

		await this.flush();
		return results;
	}

	async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const image = await this.repos.image.getById(params.id);

		return {...image, likes: image.likes.length, pointOfInterest: undefined};
	}

	async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		const image = await this.repos.image.getById(params.id);
		this.permissionService.canEditImage({targetId: image.user.id}, auth);

		await this.spacesManagementService.remove(image.url);

		if (image.status === ImageStatusEnum.Approved) {
			image.user.score = image.user.score - 10;
		}
		image.user.score = image.user.score - image.likes.length;

		this.repos.image.remove(image);

		await this.flush();

		return {success: true};
	}

	async like(params: Params<Route<'like'>>, auth?: AuthContext): Promise<Response<Route<'like'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);

		const image = await this.repos.image.getById(params.id);

		const existingLike = await this.repos.imageLike.findOne({
			image: image.id,
			user: userId,
		});

		if (existingLike) {
			return {success: true};
		}

		const newLike = new ImageLike({
			image,
			user,
		});

		image.user.score = image.user.score + 1;

		this.persist(newLike);
		await this.flush();

		return {success: true};
	}

	async unLike(params: Params<Route<'unLike'>>, auth?: AuthContext): Promise<Response<Route<'unLike'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const existingLike = await this.repos.imageLike.findOne({
			image: params.id,
			user: userId,
		});

		if (!existingLike) {
			return {success: true};
		}

		const image = await this.repos.image.getById(params.id);

		image.user.score = Math.max(0, image.user.score - 1);

		this.repos.imageLike.remove(existingLike);
		await this.flush();

		return {success: true};
	}

	async hasLiked(params: Params<Route<'hasLiked'>>, auth?: AuthContext): Promise<Response<Route<'hasLiked'>>> {
		if (!auth?.userId) return {liked: false, likeCount: 0};

		const like = await this.repos.imageLike.findLike(params.id, auth.userId);
		const image = await this.repos.image.getById(params.id);
		return {liked: Boolean(like), likeCount: image.likes.length};
	}

	async getPendingImages(params: Params<Route<'getPendingImages'>>, auth?: AuthContext): Promise<Response<Route<'getPendingImages'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const images = await this.repos.image.find({status: ImageStatusEnum.Pending}, {populate: ['user', 'pointOfInterest']});
		return images.map(image => ({...image}));
	}

	async approveImage(params: Params<Route<'approveImage'>>, auth?: AuthContext): Promise<Response<Route<'approveImage'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const image = await this.repos.image.getById(id);

		image.status = ImageStatusEnum.Approved;
		image.user.score = image.user.score + 10;

		await this.flush();

		return {...image};
	}

	async rejectImage(params: Params<Route<'rejectImage'>>, auth?: AuthContext): Promise<Response<Route<'rejectImage'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const image = await this.repos.image.getById(id);

		await this.spacesManagementService.remove(image.url);

		this.repos.image.remove(image);
		await this.flush();

		return {success: true};
	}
}
