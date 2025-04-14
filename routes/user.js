const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/users.js");

// ✅ Signup Routes
router.route("/signup")
    .get(userController.renderSignup)  // Signup form
    .post(userController.signup);      // Signup logic

// ✅ Login Routes (Using Passport before calling controller)
router.route("/login")
    .get(userController.renderLogin)   // Login form
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }), userController.login); // Login logic

// ✅ Logout Route (Now using async logout)
router.get("/logout", userController.logout);

module.exports = router;
