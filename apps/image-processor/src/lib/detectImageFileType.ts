// lib/getImageFileType.ts
export interface DetectedFileType {
	ext: string;
	mime: string;
}

export function detectImageFileType(buffer: Buffer): DetectedFileType | null {
	if (buffer.length < 12) return null;

	const hex = buffer.toString('hex', 0, 12);

	// JPEG: FF D8 FF
	if (hex.startsWith('ffd8ff')) {
		return {ext: 'jpg', mime: 'image/jpeg'};
	}

	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if (hex.startsWith('89504e470d0a1a0a')) {
		return {ext: 'png', mime: 'image/png'};
	}

	// WEBP: RIFF .... WEBP
	if (hex.startsWith('52494646') && buffer.toString('hex', 8, 12) === '57454250') {
		return {ext: 'webp', mime: 'image/webp'};
	}

	// GIF: GIF87a or GIF89a
	if (hex.startsWith('47494638')) {
		return {ext: 'gif', mime: 'image/gif'};
	}

	// AVIF / HEIC: ftyp box checks
	if (buffer.toString('ascii', 4, 8) === 'ftyp') {
		const brand = buffer.toString('ascii', 8, 12);
		if (brand === 'avif' || brand === 'avis') {
			return {ext: 'avif', mime: 'image/avif'};
		}
		if (brand === 'heic' || brand === 'heix' || brand === 'mif1') {
			return {ext: 'heic', mime: 'image/heic'};
		}
	}

	return null;
}
