import { EntityRepository } from "@mikro-orm/postgresql";
import { Country } from "../entities/Country";






export class CountryRepository extends EntityRepository<Country>{
 
    async getCountryById(id:string){
      const country = await this.em.findOne(Country,
        {id:id},
        {populate:["regions"]}
      )
       if (!country) throw new Error('Country not found.');

        return {
            id:country.id,
            name:country.name,
            regions:country.regions.getItems().map(region => ({
                id:region.id,
                name:region.name,
                countryId:region.country.id
            }))
        }

    }


}