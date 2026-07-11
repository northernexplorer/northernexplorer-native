import { EntityRepository } from "@mikro-orm/postgresql";
import { Country } from "../entities/Country";
import { version } from "node:punycode";






export class CountryRepository extends EntityRepository<Country>{
 
    async getCountryById(id:string){
      const country = await this.em.findOne(Country,
        {id:id},
        {populate:["regions"]}
      )
       if (!country) throw new Error('Country not found.');

        return {
            id:country.id,
            version:country.version,
            name:country.name,
            regions:country.regions.getItems().map(region => ({
                id:region.id,
                version:region.version,
                name:region.name,
                countryId:region.country.id
            }))
        }

    }


}