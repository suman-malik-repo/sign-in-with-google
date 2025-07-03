const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    const token = req.signedCookies.auth_token;

    if (!token) return res.redirect("/");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie("auth_token");
        res.redirect("/");
    }
};

module.exports = { isAuthenticated };
