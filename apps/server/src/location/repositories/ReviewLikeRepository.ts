import {BaseRepository} from '../../core/BaseRepository'
import { ReviewLike } from '../entities/ReviewLike'

export class ReviewLikeRepository extends BaseRepository<ReviewLike> {
  
   async findLike(reviewId:string,userId:string){
       return this.findOne({
        review:reviewId,
        user:userId
       })

   }
}