import sharp from 'sharp';

export interface AvatarVariants {
	large: Buffer;
	thumbnail: Buffer;
}

/**
 * Generates _large (1000x1000) and _thumbnail (100x100) JPEG buffers from an input image buffer.
 * Auto-orients based on EXIF metadata and crops/resizes with cover fit centered.
 */
export async function createAvatarJpgVariants(fileBuffer: Buffer): Promise<AvatarVariants> {
	const pipeline = sharp(fileBuffer).rotate(); // Auto-orient based on EXIF

	const [large, thumbnail] = await Promise.all([
		pipeline.clone().resize({width: 1000, height: 1000, fit: 'cover', position: 'centre'}).jpeg({quality: 85, mozjpeg: true}).toBuffer(),

		pipeline.clone().resize({width: 100, height: 100, fit: 'cover', position: 'centre'}).jpeg({quality: 80, mozjpeg: true}).toBuffer(),
	]);

	return {
		large,
		thumbnail,
	};
}
