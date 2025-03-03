require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const app = express();

// Middleware
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser(process.env.COOKIE_SECRET)); // Enable signed cookies using a secret key
app.set("view engine", "ejs"); // Set view engine to EJS

// Configure Passport with Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret from environment variables
    callbackURL: "/auth/google/callback" // Callback URL after successful authentication
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    return done(null, profile); // Pass user profile to callback
}));

// Middleware to check authentication via cookies
const isAuthenticated = (req, res, next) => {
    const token = req.signedCookies.auth_token; // Get token from signed cookies
    if (!token) return res.redirect("/"); // Redirect to home if no token found

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
        req.user = decoded; // Attach decoded user info to request object
        next(); // Proceed to the next middleware
    } catch (err) {
        res.clearCookie("auth_token"); // Clear invalid token
        res.redirect("/"); // Redirect to home
    }
};

// Routes
app.get("/", (req, res) => {
    const token = req.signedCookies.auth_token; // Get authentication token
    let user = null;

    if (token) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET); // Decode token
        } catch (err) {
            res.clearCookie("auth_token"); // Clear invalid token
        }
    }

    res.render("index", { user }); // Render homepage with user info if authenticated
});

app.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile", { user: req.user }); // Render profile page if authenticated
});

// Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }), // Disable session-based auth
    (req, res) => {
        // Generate JWT Token with user information
        const token = jwt.sign(
            {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.emails[0].value,
                photo: req.user.photos[0].value,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
        );

        // Set authentication token as a signed cookie
        res.cookie("auth_token", token, {
            httpOnly: true, // Prevents client-side JavaScript access
            signed: true, // Uses signed cookies for security
            secure: false, // Set to true in production (requires HTTPS)
            maxAge: 1000 * 60 * 60 * 24 * 7 // Token valid for 7 days
        });

        res.redirect("/profile"); // Redirect to profile page after login
    }
);

app.get("/public",(req,res)=>{
    return res.send("public route...")
})

// Logout - Clear authentication cookie
app.get("/logout", (req, res) => {
    res.clearCookie("auth_token"); // Remove authentication cookie
    res.redirect("/"); // Redirect to home page
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));