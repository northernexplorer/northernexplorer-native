import { EntityRepository } from "@mikro-orm/postgresql";
import { Review } from "../entities/ReviewEntity";

export class ReviewRepository extends EntityRepository<Review>{

  async getReviewsById(id:string){
       const review = await this.em.findOneOrFail(Review,{id:id},{populate:['user','HistoricSite']})
        
       return {
         id:review.id,
         user:review.user.username,
         historicSite:review.HistoricSite.name,
         rating:review.rating
       }
  }

}