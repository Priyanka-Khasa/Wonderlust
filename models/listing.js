const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  // 🗺️ Add this for storing geolocation from Mapbox
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // 'Point' is the GeoJSON type
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["Amazing Pools", "Rooms", "Trending", "Farms", "Beach", "Big House", "Artic", "Lake","Iconic Cities","Camping","Domes","HouseBoats"], // add all you want
    required: true,
  }
});

// 🧹 Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
