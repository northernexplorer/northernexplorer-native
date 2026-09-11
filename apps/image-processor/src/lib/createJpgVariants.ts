// lib/convertToJpg.ts
import sharp from 'sharp';

export interface ImageVariants {
	large: Buffer;
	thumbnail: Buffer;
}

/**
 * Generates _large and _thumbnail JPEG buffers from an input image buffer.
 * Auto-orients based on EXIF metadata and resizes proportionally.
 */
export async function createJpgVariants(fileBuffer: Buffer): Promise<ImageVariants> {
	const pipeline = sharp(fileBuffer).rotate(); // Auto-orient based on EXIF

	const large = await pipeline
		.clone()
		.resize({width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true})
		.jpeg({quality: 85, mozjpeg: true})
		.toBuffer();

	const thumbnail = await pipeline.clone().resize({width: 400, height: 400, fit: 'cover'}).jpeg({quality: 80, mozjpeg: true}).toBuffer();

	return {large, thumbnail};
}
