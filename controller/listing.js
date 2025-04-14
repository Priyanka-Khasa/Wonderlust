const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route Controller (Displays all listings)
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong while fetching listings.");
        res.redirect("/");
    }
};

// Show Listing Controller (Displays details of a single listing)
module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }

        res.render("listings/show", { listing, currUser: req.user || null });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};

// Create Listing Controller (Handles Image Upload)
module.exports.createListing = async (req, res) => {
    try {
        // Get location from form
        const geoData = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,  // 📍 Take dynamic location from form
            limit: 1
        }).send();

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // ✅ Save coordinates to Listing (assuming your schema has geometry field)
        newListing.geometry = geoData.body.features[0].geometry;

        // ✅ Handle Image Upload
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/new");
    }
};


// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }

        // ✅ Resize the image using Cloudinary URL transformation
        let originalImageUrl = listing.image.url;
        let resizedImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

        // ✅ Pass resizedImageUrl to the template
        res.render("listings/edit.ejs", { listing, resizedImageUrl });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};

// Update Listing Controller (Handles Image Update)
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }

        let updatedData = { ...req.body.listing };

        // ✅ Handle Image Update
        if (req.file) {
            updatedData.image = {
                url: req.file.path,  // Cloudinary URL
                filename: req.file.filename
            };
        }

        await Listing.findByIdAndUpdate(id, updatedData, { new: true });
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to update listing.");
        res.redirect("/listings");
    }
};

// Delete Listing Controller
module.exports.deleteListing = async (req, res) => {
    try {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to delete listing.");
        res.redirect("/listings");
    }
};
