import {BaseRepository} from '../../core/BaseRepository';
import {Support} from '../entities/Support';

export class SupportRepository extends BaseRepository<Support> {
	async getByUrl(url: string) {
		return this.findOneOrFail({url});
	}

	async getHeadings() {
		return this.findAll({
			fields: ['id', 'title', 'url'],
			orderBy: {title: 'asc'},
		});
	}
}
