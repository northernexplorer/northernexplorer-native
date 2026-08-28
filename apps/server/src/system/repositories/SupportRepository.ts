import {BaseRepository} from '../../core/BaseRepository';
import {Support} from '../entities/Support';

export class SupportRepository extends BaseRepository<Support> {
	async getByUrl(url: string) {
		return this.findOneOrFail({url});
	}

	async getAll() {
		return this.findAll({orderBy: {title: 'asc'}});
	}
}
