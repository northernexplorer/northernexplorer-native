import { EntityRepository } from "@mikro-orm/postgresql";
import { Region } from "../entities/Region";
export class RegionRepository extends EntityRepository<Region> {
    
    async getRegionById(id:string){
      const region = await this.em.findOne(Region,
        {id:id}
      )

        if (!region) throw new Error('Region not found.');

        return{
            id:region.id,
            name:region.name,
            countryId: region.country.id
        }
    }

}