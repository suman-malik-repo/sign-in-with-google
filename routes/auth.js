const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Google OAuth route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.emails[0].value,
                photo: req.user.photos[0].value,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            signed: true,
            secure: false, // Change to true in production with HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.redirect("/profile");
    }
);



module.exports = router;
