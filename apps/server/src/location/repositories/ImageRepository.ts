import path from 'node:path';
import {ImageStatusEnum} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Image} from '../../location';
import {config} from '../../config';
import {User} from '../../user';
import {sql} from '@mikro-orm/core';

export class ImageRepository extends BaseRepository<Image> {
	async getById(id: string) {
		return this.findOneOrFail({id}, {populate: ['user', 'likes']});
	}

	generateNewUrl({fileExtension}: {fileExtension: string}): string {
		const ext = fileExtension.startsWith('.') ? fileExtension : `.${fileExtension}`;

		const now = new Date();
		const year = now.getUTCFullYear().toString();
		const month = String(now.getUTCMonth() + 1).padStart(2, '0');
		const day = String(now.getUTCDate()).padStart(2, '0');

		const uniqueSuffix = Math.random().toString(36).substring(2, 8);
		const filename = `${now.getTime()}-${uniqueSuffix}${ext}`;

		return path.posix.join('uploads', config.SPACES_DOCUMENT_ROOT || '', year, month, day, filename);
	}

	getDuplicate(hash: string, user: User) {
		return this.findOne({hash, user});
	}

	async topFiveImages() {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const status = ImageStatusEnum.Approved;

		// Use sql tag instead of raw string with $1, $2
		const rows = await this.execute<{id: string}[]>(sql`
       SELECT i.id
       FROM image i
       LEFT JOIN image_like l ON l.image_id = i.id
       WHERE i.status = ${status} AND i.created_at >= ${thirtyDaysAgo}
       GROUP BY i.id
       ORDER BY COUNT(l.id) DESC
       LIMIT 5
    `);

		if (rows.length === 0) {
			return [];
		}

		const ids = rows.map(r => r.id);

		const entities = await this.find({id: {$in: ids}});

		await this.getEntityManager().populate(entities, ['user', 'pointOfInterest', 'likes']);

		return ids.map(id => entities.find(e => e.id === id)).filter((e): e is Image => e !== undefined);	}
}
