import {BaseRepository} from '../../core/BaseRepository';
import {Country} from '../entities/Country';

export class CountryRepository extends BaseRepository<Country> {
	async getById(id: string) {
		return this.findOneOrFail({id}, {populate: ['regions']});
	}

	async getAll() {
		return this.findAll({orderBy: {name: 'asc'}});
	}
}
