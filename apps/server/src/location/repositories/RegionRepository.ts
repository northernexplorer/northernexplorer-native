import {BaseRepository} from '../../core/BaseRepository';
import {Region} from '../entities/Region';
import {Country} from '../entities/Country';

export class RegionRepository extends BaseRepository<Region> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getByCountry(country: Country) {
		return this.find({country}, {orderBy: {name: 'asc'}});
	}
}
