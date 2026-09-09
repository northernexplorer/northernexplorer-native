import {Readable} from 'stream';
import {S3Client, PutObjectCommand, DeleteObjectCommand, PutObjectCommandInput} from '@aws-sdk/client-s3';
import {config} from '../../config';

export interface UploadOptions {
	bucket?: string;
	key: string;
	body: Buffer | Readable | Uint8Array | string;
	contentType: string;
	isPublic?: boolean;
	metadata?: Record<string, string>;
}

export class SpacesManagementService {
	private readonly s3Client: S3Client;
	private readonly defaultBucket: string;
	private readonly region: string;

	constructor() {
		this.region = config.SPACES_REGION;
		this.defaultBucket = config.SPACES_BUCKET;

		this.s3Client = new S3Client({
			endpoint: `https://${this.region}.digitaloceanspaces.com`,
			region: this.region,
			credentials: {
				accessKeyId: config.SPACES_ACCESS_KEY,
				secretAccessKey: config.SPACES_SECRET_KEY,
			},
		});
	}

	/**
	 * Upload an item/file buffer to DigitalOcean Spaces.
	 * Returns the final public or CDN URL of the uploaded object.
	 */
	async upload({key, body, contentType, bucket = this.defaultBucket, isPublic = true, metadata}: UploadOptions) {
		const input: PutObjectCommandInput = {
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
			ACL: isPublic ? 'public-read' : 'private',
			Metadata: metadata,
		};

		await this.s3Client.send(new PutObjectCommand(input));
	}

	/**
	 * Delete a single item from DigitalOcean Spaces.
	 */
	async remove(key: string, bucket = this.defaultBucket) {
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		await this.s3Client.send(command);
	}
}
