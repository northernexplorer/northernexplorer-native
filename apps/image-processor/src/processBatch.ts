import {Readable} from 'stream';
import {EntityName, MikroORM, RequestContext} from '@mikro-orm/core';
import {entities} from 'northernexplorer-server';
import {ImageType} from '@northernexplorer/types';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {streamToBuffer} from './lib/streamToBuffer';
import {detectImageFileType} from './lib/detectImageFileType';
import {createJpgVariants} from './lib/createJpgVariants';
import {getVariantKeys} from './lib/getVariantKeys';

const BATCH_SIZE = 50;

export async function processBatch(orm: MikroORM<PostgreSqlDriver>, spacesService: SpacesManagementService): Promise<void> {
	await RequestContext.create(orm.em, async () => {
		const em = orm.em.fork();
		const Image = entities.find(e => e.name === 'Image') as EntityName | undefined;
		if (!Image) throw new Error('Image entity not found in exported entities array.');

		const unprocessedImages: ImageType[] = await em.find(Image, {processed: false}, {limit: BATCH_SIZE, orderBy: {createdAt: 'ASC'}});

		if (unprocessedImages.length === 0) {
			console.log(`[${new Date().toISOString()}] No unprocessed images found.`);
			return;
		}

		console.log(`[${new Date().toISOString()}] Found ${unprocessedImages.length} image(s) to process.`);

		for (const image of unprocessedImages) {
			try {
				// 1. Get original object key without leading slash
				const originalKey = image.url.replace(/^\/+/, '');

				console.log(`Processing image ID: ${image.id} (Original Key: ${originalKey})...`);

				// 2. Fetch original file stream from Spaces (UNMODIFIED)
				const {body, contentType} = await spacesService.getObject(originalKey);
				if (!body) throw new Error(`Empty object body returned for key: ${originalKey}`);

				// 3. Convert stream to buffer & verify file type
				const originalBuffer = await streamToBuffer(body as Readable);
				const detected = detectImageFileType(originalBuffer);

				console.log(`Original file size: ${originalBuffer.length} bytes | Type: ${detected?.mime || contentType}`);

				// 4. Generate _large.jpg and _thumbnail.jpg variants
				const {large, thumbnail} = await createJpgVariants(originalBuffer);
				const {largeKey, thumbnailKey} = getVariantKeys(originalKey);

				// 5. Upload _large.jpg to Spaces
				await spacesService.upload({
					key: largeKey,
					body: large,
					contentType: 'image/jpeg',
					isPublic: true,
				});

				// 6. Upload _thumbnail.jpg to Spaces
				await spacesService.upload({
					key: thumbnailKey,
					body: thumbnail,
					contentType: 'image/jpeg',
					isPublic: true,
				});

				console.log(`Uploaded variants for ID ${image.id}:`);
				console.log(` - Large: ${largeKey} (${large.length} bytes)`);
				console.log(` - Thumbnail: ${thumbnailKey} (${thumbnail.length} bytes)`);

				// 7. Keep original properties intact and flag as processed
				image.size = originalBuffer.length;
				image.mimeType = detected?.mime || contentType || 'application/octet-stream';
				image.fileExtension = detected?.ext || image.fileExtension;
				image.processed = true;
			} catch (err) {
				console.error(`Failed to process image ID: ${image.id}`, err);
			}
		}

		// 8. Persist batch updates
		await em.flush();
		console.log(`Successfully completed batch processing.`);
	});
}
