import {Readable} from 'stream';
import type {EntityManager} from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import {SpacesManagementService} from '@northernexplorer/tools-server';
import {ReportReasonEnum, ReportTypeEnum} from '@northernexplorer/types';
import {streamToBuffer} from './lib/streamToBuffer';
import {detectImageFileType} from './lib/detectImageFileType';
import {createJpgVariants} from './lib/createJpgVariants';
import {getVariantKeys} from './lib/getVariantKeys';
import {formatMb} from './lib/formatMb';
import {Image} from './Image';
import {Report} from './Report';

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function processImage(
	image: Image,
	em: Pick<EntityManager<PostgreSqlDriver>, 'persist'>,
	spacesService: SpacesManagementService,
): Promise<void> {
	try {
		// Get original object key without leading slash
		const originalKey = image.url.replace(/^\/+/, '');

		console.log(`\n[Image ID: ${image.id}] Fetching key: ${originalKey}`);

		// Fetch original file stream from Spaces (UNMODIFIED)
		const {body, contentType} = await spacesService.getObject(originalKey);
		if (!body) throw new Error(`Empty object body returned for key: ${originalKey}`);

		// Convert stream to buffer & verify file type
		const originalBuffer = await streamToBuffer(body as Readable);
		const detected = detectImageFileType(originalBuffer);

		console.log(`[Image ID: ${image.id}] Original size: ${formatMb(originalBuffer.length)} | Type: ${detected?.mime || contentType}`);

		// Generate _large.jpg, _thumbnail.jpg, and optional _cover.jpg variants
		const {large, thumbnail, cover, originalWidth, originalHeight} = await createJpgVariants(originalBuffer);
		const {largeKey, thumbnailKey, coverKey} = getVariantKeys(originalKey);

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

		console.log(`[Image ID: ${image.id}] Uploaded variants:`);
		console.log(` ├─ Large: ${largeKey} (${formatMb(large.length)})`);
		console.log(` ├─ Thumbnail: ${thumbnailKey} (${formatMb(thumbnail.length)})`);

		// Upload _cover.jpg if generated (landscape images)
		if (cover) {
			await spacesService.upload({
				key: coverKey,
				body: cover,
				contentType: 'image/jpeg',
			});
			console.log(` └─ Cover: ${coverKey} (${formatMb(cover.length)})`);
		}

		if (originalWidth !== undefined && originalHeight !== undefined && (originalWidth < 250 || originalHeight < 250)) {
			em.persist(
				new Report({
					type: ReportTypeEnum.Image,
					reason: ReportReasonEnum.LowQuality,
					description: `Automatically reported because the original image is ${originalWidth}×${originalHeight} pixels (under 250 pixels in at least one dimension).`,
					userId: SYSTEM_USER_ID,
					image,
				}),
			);
		}

		if (cover) image.canBeCover = true;
		image.size = originalBuffer.length;
		image.mimeType = detected?.mime || contentType || 'application/octet-stream';
		image.fileExtension = detected?.ext || image.fileExtension;
		image.processed = true;
	} catch (err) {
		console.error(`[Image ID: ${image.id}] Processing failed:`, err);
	}
}
