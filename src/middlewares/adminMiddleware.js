require('dotenv').config();

function adminMiddleware(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    next();
}

module.exports = adminMiddleware;
