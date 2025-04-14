const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
// Configure Multer for file uploads
const upload = multer({storage });

// Middleware for validation
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Routes
router.route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing,  
        wrapAsync(listingController.createListing)
    ); // Create Route with Image Upload

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(listingController.updateListing)
    ) // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete Route

router.get("/:id/edit", isLoggedIn, isOwner, 
    wrapAsync(listingController.renderEditForm));

module.exports = router;

