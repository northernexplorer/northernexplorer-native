import sharp from 'sharp';

export interface ImageVariants {
	large: Buffer;
	thumbnail: Buffer;
	cover?: Buffer;
}

/**
 * Generates _large, _thumbnail, and optional _cover JPEG buffers from an input image buffer.
 * Auto-orients based on EXIF metadata and resizes proportionally.
 * Cover variant is only generated for landscape images (width > height).
 */
export async function createJpgVariants(fileBuffer: Buffer): Promise<ImageVariants> {
	const pipeline = sharp(fileBuffer).rotate(); // Auto-orient based on EXIF
	const metadata = await pipeline.metadata();

	const isLandscape = metadata.width > metadata.height;

	const [large, thumbnail, cover] = await Promise.all([
		pipeline.clone().resize({width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true}).jpeg({quality: 85, mozjpeg: true}).toBuffer(),

		pipeline.clone().resize({width: 400, height: 400, fit: 'cover', position: 'centre'}).jpeg({quality: 80, mozjpeg: true}).toBuffer(),

		isLandscape
			? pipeline.clone().resize({width: 1200, height: 630, fit: 'cover', position: 'centre'}).jpeg({quality: 85, mozjpeg: true}).toBuffer()
			: Promise.resolve(undefined),
	]);

	return {
		large,
		thumbnail,
		...(cover && {cover}),
	};
}
