import path from 'node:path';
import {BaseRepository} from '../../core/BaseRepository';
import {Image} from '../../location';
import {config} from '../../config';

export class ImageRepository extends BaseRepository<Image> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	generateNewUrl({fileExtension}: {fileExtension: string}): string {
		const ext = fileExtension.startsWith('.') ? fileExtension : `.${fileExtension}`;

		const now = new Date();
		const year = now.getUTCFullYear().toString();
		const month = String(now.getUTCMonth() + 1).padStart(2, '0');
		const day = String(now.getUTCDate()).padStart(2, '0');

		const uniqueSuffix = Math.random().toString(36).substring(2, 8);
		const filename = `${now.getTime()}-${uniqueSuffix}${ext}`;

		return path.posix.join('uploads', config.DOCUMENT_ROOT || '', year, month, day, filename);
	}
}
