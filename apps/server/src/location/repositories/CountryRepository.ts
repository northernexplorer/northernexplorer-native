import {EntityRepository} from '@mikro-orm/postgresql';
import {Country} from '../entities/Country';

export class CountryRepository extends EntityRepository<Country> {
	async getCountryById(id: string) {
		return this.em.findOneOrFail(Country, {id: id}, {populate: ['regions']});
	}

	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.findAll({orderBy: {name: 'asc'}});
	}
}
