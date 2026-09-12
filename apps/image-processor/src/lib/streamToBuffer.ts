import {Readable} from 'stream';

/**
 * Helper to convert S3 Readable Stream into a Buffer
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
		stream.on('error', err => reject(err));
		stream.on('end', () => resolve(Buffer.concat(chunks)));
	});
}
