const jwt = require("jsonwebtoken");

// Middleware to verify if a user is logged in
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attaches { id, role } to the request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

// Middleware to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access Denied: Admins Only" });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };