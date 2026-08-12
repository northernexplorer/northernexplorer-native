import {BaseRepository} from '../../core/BaseRepository';
import {Region} from '../entities/Region';
import {Country} from '../entities/Country';

export class RegionRepository extends BaseRepository<Region> {
	async getRegionById(id: string) {
		const region = await this.findOneOrFail({id});

		return {
			id: region.id,
			version: region.version,
			name: region.name,
			countryId: region.country.id,
		};
	}

	async getById(id: string) {
		return this.findOneOrFail({id});
	}
	async getByCountry(country: Country) {
		return this.find({country}, {orderBy: {name: 'asc'}});
	}
}
