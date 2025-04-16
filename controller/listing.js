const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ✅ Allowed categories (must match enum values exactly)
const allowedCategories = [
  "Amazing Pools", "Rooms", "Trending", "Farms", "Beach", "Big House",
  "Artic", "Lake", "Iconic Cities", "Camping", "Domes", "HouseBoats"
];

// ✅ INDEX ROUTE – Show all or filtered listings
module.exports.index = async (req, res) => {
  try {
    const { category } = req.query;
    let allListings;

    if (category && allowedCategories.includes(category)) {
      allListings = await Listing.find({ category });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong while fetching listings.");
    res.redirect("/");
  }
};

// ✅ SHOW ROUTE – Single Listing
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

// ✅ CREATE ROUTE – Add New Listing
module.exports.createListing = async (req, res) => {
  try {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = geoData.body.features[0].geometry;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
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

// ✅ EDIT FORM ROUTE
module.exports.renderEditForm = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    let resizedImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, resizedImageUrl });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
};

// ✅ UPDATE ROUTE – Modify Listing
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }

    let updatedData = { ...req.body.listing };

    if (req.file) {
      updatedData.image = {
        url: req.file.path,
        filename: req.file.filename,
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

// ✅ DELETE ROUTE
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
