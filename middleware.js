const Listing = require("./models/listing"); 
const Review = require("./models/review"); // ✅ Fixed variable name (Review instead of review)

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the attempted URL
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to store the redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Store URL in locals for use in templates if needed
    }
    next();
};

// Middleware to check if the logged-in user is the listing owner
module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(req.user._id)) {  
            req.flash("error", "You don't have permission to edit this listing!");
            return res.redirect(`/listings/${id}`);
        }

        next(); // ✅ Allow execution if the user is the owner
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

// Middleware to check if the logged-in user is the review author
module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { reviewId } = req.params;
        let review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect("/listings");
        }

        // ✅ Check if the logged-in user is the review author
        if (!review.author.equals(req.user._id)) {  
            req.flash("error", "You don't have permission to delete this review!");
            return res.redirect("back");
        }

        next(); // ✅ Allow execution if the user is the author
    } catch (error) {
        console.error("Error in isReviewAuthor middleware:", error);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};
