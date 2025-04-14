const User = require("../models/user.js");

// ✅ Render Signup Page
module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

// ✅ Handle User Signup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        console.log("✅ New User Registered:", registeredUser);

        // Automatically log in after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// ✅ Render Login Page
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

// ✅ Handle User Login (No authentication logic here)
module.exports.login = (req, res) => {
    let redirectUrl = req.session.redirectUrl || "/listings"; // Default redirect
    delete req.session.redirectUrl; // Clear stored redirect

    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(redirectUrl);
};

// ✅ Handle Logout (Fixed for Passport v0.6+)
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err); // ⛔ will trigger 500 if you don’t handle this
        }
        req.flash("success", "You have logged out!");
        res.redirect("/listings");
    });
};

