const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ Enables access to ":id" from parent routes
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");

// Middleware to validate reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// ✅ Create Review Route (Fixed)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// ✅ Delete Review Route (Refactored)
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;

