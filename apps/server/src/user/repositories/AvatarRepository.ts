import path from 'node:path';
import {BaseRepository} from '../../core/BaseRepository';
import {Avatar, User} from '../../user';
import {config} from '../../config';

export class AvatarRepository extends BaseRepository<Avatar> {
	async getById(id: string) {
		return this.findOneOrFail({id}, {populate: ['user']});
	}

	async getByUsername(user: User) {
		return this.find({user});
	}

	generateNewUrl({fileExtension}: {fileExtension: string}): string {
		const ext = fileExtension.startsWith('.') ? fileExtension : `.${fileExtension}`;

		const now = new Date();
		const year = now.getUTCFullYear().toString();
		const month = String(now.getUTCMonth() + 1).padStart(2, '0');
		const day = String(now.getUTCDate()).padStart(2, '0');

		const uniqueSuffix = Math.random().toString(36).substring(2, 8);
		const filename = `${now.getTime()}-${uniqueSuffix}${ext}`;

		return path.posix.join('uploads', config.SPACES_DOCUMENT_ROOT || '', 'avatars', year, month, day, filename);
	}

	getDuplicate(hash: string, user: User) {
		return this.findOne({hash, user});
	}
}
