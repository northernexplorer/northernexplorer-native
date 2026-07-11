import { EntityRepository } from '@mikro-orm/postgresql';
import { Country } from '../entities/Country';

export class CountryRepository extends EntityRepository<Country> {
    async getCountryById(id: string) {
        const country = await this.em.findOneOrFail(Country, { id: id }, { populate: ['regions'] });

        return {
            id: country.id,
            version: country.version,
            name: country.name,
            regions: country.regions.getItems().map((region) => ({
                id: region.id,
                version: region.version,
                name: region.name,
                countryId: region.country.id,
            })),
        };
    }
}
