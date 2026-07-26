import { ReviewType } from "./Review"


export enum ReviewRatingEnum {
TERRIBLE = 1,
POOR = 2,
AVERAGE = 3,
GOOD = 4,
EXCELLENT = 5,
}

export const ReviewController = {
    getReviewById:{
       params: {} as {id: string},
       response: null as unknown as ReviewType,
    }
}