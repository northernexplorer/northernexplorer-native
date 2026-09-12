import {Readable} from 'stream';
import {Buffer} from 'node:buffer';
import {S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommandInput} from '@aws-sdk/client-s3';

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

	constructor({
		accessKeyId,
		secretAccessKey,
		region,
		defaultBucket,
	}: {
		accessKeyId: string;
		secretAccessKey: string;
		region: string;
		defaultBucket: string;
	}) {
		this.region = region;
		this.defaultBucket = defaultBucket;

		this.s3Client = new S3Client({
			endpoint: `https://${this.region}.digitaloceanspaces.com`,
			region: this.region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}

	/**
	 * Get an object from DigitalOcean Spaces.
	 * Returns the stream/buffer along with ContentType and Metadata.
	 */
	async getObject(key: string, bucket = this.defaultBucket) {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const response = await this.s3Client.send(command);

		return {
			body: response.Body,
			contentType: response.ContentType,
			contentLength: response.ContentLength,
			metadata: response.Metadata,
		};
	}

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

	async remove(key: string, bucket = this.defaultBucket) {
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		await this.s3Client.send(command);
	}
}
