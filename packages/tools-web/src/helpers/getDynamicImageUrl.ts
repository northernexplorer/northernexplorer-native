export function getDynamicImageUrl({
	path,
	cdn,
	size,
	processed,
}: {
	path: string;
	cdn: string;
	size: 'large' | 'thumbnail';
	processed: boolean;
}): string {
	// 1. If it's already a full network URL, return as-is
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	// 2. Clean leading and trailing slash formatting
	const cleanCdn = cdn.replace(/\/+$/, '');
	let cleanPath = path.replace(/^\/+/, '');

	// 3. If image is processed and a size variant is requested, convert path to variant key
	if (processed) {
		// Strip existing extension (e.g., "uploads/images/file.png" -> "uploads/images/file")
		const basePath = cleanPath.replace(/\.[^/.]+$/, '');
		cleanPath = `${basePath}_${size}.jpg`;
	}

	return `${cleanCdn}/${cleanPath}`;
}
