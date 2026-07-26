import { ReviewType } from "./Review";
export declare enum ReviewRatingEnum {
    TERRIBLE = 1,
    POOR = 2,
    AVERAGE = 3,
    GOOD = 4,
    EXCELLENT = 5
}
export declare const ReviewController: {
    getReviewById: {
        params: {
            id: string;
        };
        response: ReviewType;
    };
};
