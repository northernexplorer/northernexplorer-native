"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = exports.ReviewRatingEnum = void 0;
var ReviewRatingEnum;
(function (ReviewRatingEnum) {
    ReviewRatingEnum[ReviewRatingEnum["TERRIBLE"] = 1] = "TERRIBLE";
    ReviewRatingEnum[ReviewRatingEnum["POOR"] = 2] = "POOR";
    ReviewRatingEnum[ReviewRatingEnum["AVERAGE"] = 3] = "AVERAGE";
    ReviewRatingEnum[ReviewRatingEnum["GOOD"] = 4] = "GOOD";
    ReviewRatingEnum[ReviewRatingEnum["EXCELLENT"] = 5] = "EXCELLENT";
})(ReviewRatingEnum || (exports.ReviewRatingEnum = ReviewRatingEnum = {}));
exports.ReviewController = {
    getReviewById: {
        params: {},
        response: null,
    }
};
