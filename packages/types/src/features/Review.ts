
import { ReviewRatingEnum } from "./ReviewController"

export type ReviewType = {
    id:string,
    user: string,
    historicSite:string,
    rating:ReviewRatingEnum
}

