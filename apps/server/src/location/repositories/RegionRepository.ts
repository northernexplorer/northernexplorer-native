import {EntityRepository} from '@mikro-orm/postgresql';
import {Region} from '../entities/Region';
export class RegionRepository extends EntityRepository<Region> {
	async getRegionById(id: string) {
		const region = await this.em.findOneOrFail(Region, {id: id});

		return {
			id: region.id,
			version: region.version,
			name: region.name,
			countryId: region.country.id,
		};
	}
}
