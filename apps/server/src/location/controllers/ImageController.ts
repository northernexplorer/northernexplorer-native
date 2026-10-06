import {createHash} from 'node:crypto';
import {ImageStatusEnum, ImageUploadStatus, Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Image} from '../entities/Image';
import {ImageLike} from '../entities/ImageLike';
import {config} from '../../config';

type Route<M extends keyof ROUTES['location']['ImageController']> = RouteDefinition<'location', 'ImageController'>[M];

export class ImageController extends BaseController {
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

	/**
	 * Helper to remove the original file as well as _large.jpg and _thumbnail.jpg variants from DigitalOcean Spaces.
	 */
	private async removeWithVariants(image: Image) {
		const originalKey = image.url.replace(/^\/+/, '');
		const dotIndex = originalKey.lastIndexOf('.');
		const basePath = dotIndex !== -1 ? originalKey.substring(0, dotIndex) : originalKey;

		const largeKey = `${basePath}_large.jpg`;
		const thumbnailKey = `${basePath}_thumbnail.jpg`;
		const coverKey = `${basePath}_cover.jpg`;

		// Deletes original file and variant keys concurrently.
		// Ignores missing file errors if variants haven't been processed yet.
		await Promise.all([
			this.spacesManagementService.remove(originalKey).catch(() => null),
			image.processed ? this.spacesManagementService.remove(largeKey).catch(() => null) : Promise.resolve(),
			image.processed ? this.spacesManagementService.remove(thumbnailKey).catch(() => null) : Promise.resolve(),
			image.canBeCover ? this.spacesManagementService.remove(coverKey).catch(() => null) : Promise.resolve(),
		]);
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

		const MAX_SINGLE_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per image limit
		if (params.file.size > MAX_SINGLE_FILE_BYTES) {
			throw new Error(`File "${params.file.filename}" exceeds the maximum individual limit of 10 MB.`);
		}

		const pointOfInterest = await this.repos.pointOfInterest.findOneOrFail({id: params.pointOfInterestId});
		const user = await this.repos.user.getById(userId);

		const fileBuffer = Buffer.from(params.file.base64, 'base64');
		const hash = createHash('sha256').update(fileBuffer).digest('hex');
		const isDuplicate = await this.repos.image.getDuplicate(hash, user);
		if (isDuplicate) {
			return {file: params.file.uri, status: ImageUploadStatus.Duplicate};
		}

		const url = this.repos.image.generateNewUrl({fileExtension: params.file.fileExtension});

		await this.spacesManagementService.upload({
			key: url,
			body: fileBuffer,
			contentType: params.file.mimeType,
		});

		let status = ImageStatusEnum.Pending;
		if (this.repos.user.isPostApproved(user)) {
			status = ImageStatusEnum.Approved;
		}

		const image = new Image({
			fileExtension: params.file.fileExtension,
			filename: params.file.filename,
			mimeType: params.file.mimeType,
			size: params.file.size,
			url,
			status,
			altText: pointOfInterest.name,
			pointOfInterest,
			user,
			hash,
		});

		this.repos.image.persist(image);

		if (this.repos.user.isPostApproved(user)) {
			user.score += 10;
		}

		await this.flush();
		return {file: params.file.uri, status: ImageUploadStatus.Success};
	}

	async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const image = await this.repos.image.getById(params.id);

		return {...image, likes: image.likes.length, pointOfInterest: undefined};
	}

	async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		const image = await this.repos.image.getById(params.id);
		this.permissionService.canEditImage({targetId: image.user.id}, auth);

		await this.removeWithVariants(image);

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
		this.persist(newLike);

		image.user.score = image.user.score + 1;
		await this.repos.pointOfInterest.setCoverImage(image);

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

	async getPending(params: Params<Route<'getPending'>>, auth?: AuthContext): Promise<Response<Route<'getPending'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const images = await this.repos.image.getPending({limit: params.limit, offset: params.offset});
		return images.map(image => ({...image}));
	}

	async approve(params: Params<Route<'approve'>>, auth?: AuthContext): Promise<Response<Route<'approve'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const image = await this.repos.image.getById(id);

		image.status = ImageStatusEnum.Approved;
		image.user.score = image.user.score + 10;

		await this.flush();

		return {...image};
	}

	async reject(params: Params<Route<'reject'>>, auth?: AuthContext): Promise<Response<Route<'reject'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		const {id} = params;
		const image = await this.repos.image.getById(id);

		await this.removeWithVariants(image);

		this.repos.image.remove(image);
		await this.flush();

		return {success: true};
	}
}
