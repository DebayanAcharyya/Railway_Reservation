const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("Auth Header:", authHeader); // 🔍 Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User:", decoded);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        console.error("JWT Error:", error.message); 
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = authMiddleware;
