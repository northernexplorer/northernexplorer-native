import {Readable} from 'stream';
import {MikroORM, RequestContext} from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {streamToBuffer} from './lib/streamToBuffer';
import {detectImageFileType} from './lib/detectImageFileType';
import {createAvatarJpgVariants} from './lib/createAvatarJpgVariants';
import {getVariantKeys} from './lib/getVariantKeys';
import {formatMb} from './lib/formatMb';
import {Image} from './Image';
import {Avatar} from './Avatar';
import {processImage} from './processImage';

const BATCH_SIZE = 50;

export async function processBatch(orm: MikroORM<PostgreSqlDriver>, spacesService: SpacesManagementService): Promise<void> {
	await RequestContext.create(orm.em, async () => {
		const em = orm.em.fork();

		const unprocessedImages = await em.find(Image, {processed: false}, {limit: BATCH_SIZE, orderBy: {createdAt: 'ASC'}});
		const unprocessedAvatars = await em.find(Avatar, {processed: false}, {limit: BATCH_SIZE, orderBy: {createdAt: 'ASC'}});

		if (unprocessedImages.length === 0 && unprocessedAvatars.length === 0) {
			console.log(`[${new Date().toISOString()}] No unprocessed images or avatars found.`);
			return;
		}

		if (unprocessedImages.length > 0) {
			console.log(`[${new Date().toISOString()}] Starting processing for ${unprocessedImages.length} image(s)...`);

			for (const image of unprocessedImages) {
				await processImage(image, em, spacesService);
			}
		}

		if (unprocessedAvatars.length > 0) {
			console.log(`[${new Date().toISOString()}] Starting processing for ${unprocessedAvatars.length} avatar(s)...`);

			for (const avatar of unprocessedAvatars) {
				try {
					// Get original object key without leading slash
					const originalKey = avatar.url.replace(/^\/+/, '');

					console.log(`\n[Avatar ID: ${avatar.id}] Fetching key: ${originalKey}`);

					// Fetch original file stream from Spaces (UNMODIFIED)
					const {body, contentType} = await spacesService.getObject(originalKey);
					if (!body) throw new Error(`Empty object body returned for key: ${originalKey}`);

					// Convert stream to buffer & verify file type
					const originalBuffer = await streamToBuffer(body as Readable);
					const detected = detectImageFileType(originalBuffer);

					console.log(
						`[Avatar ID: ${avatar.id}] Original size: ${formatMb(originalBuffer.length)} | Type: ${detected?.mime || contentType}`,
					);

					// Generate 1000x1000 (_large.jpg) and 100x100 (_thumbnail.jpg) variants
					const {large, thumbnail} = await createAvatarJpgVariants(originalBuffer);
					const {largeKey, thumbnailKey} = getVariantKeys(originalKey);

					// Upload _large.jpg to Spaces
					await spacesService.upload({
						key: largeKey,
						body: large,
						contentType: 'image/jpeg',
					});

					// Upload _thumbnail.jpg to Spaces
					await spacesService.upload({
						key: thumbnailKey,
						body: thumbnail,
						contentType: 'image/jpeg',
					});

					console.log(`[Avatar ID: ${avatar.id}] Uploaded variants:`);
					console.log(` ├─ Large: ${largeKey} (${formatMb(large.length)})`);
					console.log(` ├─ Thumbnail: ${thumbnailKey} (${formatMb(thumbnail.length)})`);

					avatar.size = originalBuffer.length;
					avatar.mimeType = detected?.mime || contentType || 'application/octet-stream';
					avatar.fileExtension = detected?.ext || avatar.fileExtension;
					avatar.processed = true;
				} catch (err) {
					console.error(`[Avatar ID: ${avatar.id}] Processing failed:`, err);
				}
			}
		}

		// Persist batch updates
		await em.flush();
		console.log(`\n[${new Date().toISOString()}] Batch processing completed successfully.`);
	});
}
