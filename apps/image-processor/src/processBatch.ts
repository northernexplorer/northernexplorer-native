import {Readable} from 'stream';
import {MikroORM, RequestContext} from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {streamToBuffer} from './lib/streamToBuffer';
import {detectImageFileType} from './lib/detectImageFileType';
import {createJpgVariants} from './lib/createJpgVariants';
import {getVariantKeys} from './lib/getVariantKeys';
import {Image} from './Image';

const BATCH_SIZE = 50;

function formatMb(bytes: number): string {
	return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export async function processBatch(orm: MikroORM<PostgreSqlDriver>, spacesService: SpacesManagementService): Promise<void> {
	await RequestContext.create(orm.em, async () => {
		const em = orm.em.fork();

		const unprocessedImages = await em.find(Image, {processed: false}, {limit: BATCH_SIZE, orderBy: {createdAt: 'ASC'}});

		if (unprocessedImages.length === 0) {
			console.log(`[${new Date().toISOString()}] No unprocessed images found.`);
			return;
		}

		console.log(`[${new Date().toISOString()}] Starting processing for ${unprocessedImages.length} image(s)...`);

		for (const image of unprocessedImages) {
			try {
				// 1. Get original object key without leading slash
				const originalKey = image.url.replace(/^\/+/, '');

				console.log(`\n[Image ID: ${image.id}] Fetching key: ${originalKey}`);

				// 2. Fetch original file stream from Spaces (UNMODIFIED)
				const {body, contentType} = await spacesService.getObject(originalKey);
				if (!body) throw new Error(`Empty object body returned for key: ${originalKey}`);

				// 3. Convert stream to buffer & verify file type
				const originalBuffer = await streamToBuffer(body as Readable);
				const detected = detectImageFileType(originalBuffer);

				console.log(`[Image ID: ${image.id}] Original size: ${formatMb(originalBuffer.length)} | Type: ${detected?.mime || contentType}`);

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

				console.log(`[Image ID: ${image.id}] Uploaded variants:`);
				console.log(` ├─ Large: ${largeKey} (${formatMb(large.length)})`);
				console.log(` └─ Thumbnail: ${thumbnailKey} (${formatMb(thumbnail.length)})`);

				// 7. Keep original properties intact and flag as processed
				image.size = originalBuffer.length;
				image.mimeType = detected?.mime || contentType || 'application/octet-stream';
				image.fileExtension = detected?.ext || image.fileExtension;
				image.processed = true;
			} catch (err) {
				console.error(`[Image ID: ${image.id}] Processing failed:`, err);
			}
		}

		// 8. Persist batch updates
		await em.flush();
		console.log(`\n[${new Date().toISOString()}] Batch processing completed successfully.`);
	});
}
