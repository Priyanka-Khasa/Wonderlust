const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // ✅ Assign logged-in user as author
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }

    let review = await Review.findById(reviewId);
    if (!review) {
        return next(new ExpressError(404, "Review Not Found"));
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};
