const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// ✅ THIS LINE IS MISSING IN YOUR FILE:
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

