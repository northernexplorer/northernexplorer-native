import {EntityName, MikroORM, RequestContext} from '@mikro-orm/core';
import {entities} from 'northernexplorer-server';
import {ImageType} from '@northernexplorer/types';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';

const BATCH_SIZE = 50;

export async function processBatch(orm: MikroORM<PostgreSqlDriver>): Promise<void> {
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

		// Process each image sequentially or in parallel
		for (const image of unprocessedImages) {
			try {
				console.log(`Processing image ID: ${image.id}...`);

				// Perform processing logic here (e.g., resizing, WebP conversion, storage uploads)
				// await processImageFile(image);

				image.processed = true;
			} catch (err) {
				console.error(`Failed to process image ID: ${image.id}`, err);
			}
		}

		// Persist changes to DB
		await em.flush();
		console.log(`Successfully completed batch processing.`);
	});
}
