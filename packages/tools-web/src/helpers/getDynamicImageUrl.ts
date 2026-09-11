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
	// Return network URLs as-is
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	// Trim slashes using string methods
	const cleanCdn = cdn.endsWith('/') ? cdn.replace(/\/+$/g, '') : cdn;
	const cleanPath = path.startsWith('/') ? path.replace(/^\/+/g, '') : path;

	// Swap extension for size variant if processed
	if (processed) {
		const extIndex = cleanPath.lastIndexOf('.');
		const basePath = extIndex !== -1 ? cleanPath.slice(0, extIndex) : cleanPath;
		return `${cleanCdn}/${basePath}_${size}.jpg`;
	}

	return `${cleanCdn}/${cleanPath}`;
}
