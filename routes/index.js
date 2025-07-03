const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
    const token = req.signedCookies.auth_token;
    let user = null;

    if (token) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            res.clearCookie("auth_token");
        }
    }

    res.render("index", { user });
});

// Profile (protected)
router.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile", { user: req.user });
});



router.get("/public", (req, res) => {
    res.send("public route...");
});

// Logout
router.get("/logout", (req, res) => {
    res.clearCookie("auth_token");
    res.redirect("/");
});

module.exports = router;
