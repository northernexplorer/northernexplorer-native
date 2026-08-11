import {BaseRepository} from '../../core/BaseRepository';
import {Country} from '../entities/Country';

export class CountryRepository extends BaseRepository<Country> {
	async getCountryById(id: string) {
		return this.findOneOrFail({id: id}, {populate: ['regions']});
	}

	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.findAll({orderBy: {name: 'asc'}});
	}
}
