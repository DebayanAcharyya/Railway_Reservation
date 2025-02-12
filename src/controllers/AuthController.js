const AuthService = require('../services/AuthService');


class AuthController {
    async register(req, res) {
        try {
            const { name, email, password , role} = req.body;
            const apiKey = req.header("x-api-key");
            // Only users with api-key can regsiter as admin
            if (role === "admin" && apiKey !== process.env.ADMIN_API_KEY) {
                return res.status(403).json({ error: "Invalid API key. Cannot register as admin." });
            }

            const user = await AuthService.register(name, email, password, role);
            res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ message: "Login successful", token, user });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
