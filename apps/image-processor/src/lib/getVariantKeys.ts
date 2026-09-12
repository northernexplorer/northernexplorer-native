export function getVariantKeys(originalKey: string) {
	// Strip current extension (e.g., "uploads/images/photo.png" or "uploads/images/photo.jpg")
	const basePath = originalKey.replace(/\.[^/.]+$/, '');

	return {
		largeKey: `${basePath}_large.jpg`,
		thumbnailKey: `${basePath}_thumbnail.jpg`,
	};
}
