const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
require('dotenv').config();

class AuthService {
    async register(name, email, password, role = "user") {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) throw new Error("User already exists");
        if (!["user", "admin"].includes(role)) {
            throw new Error("Invalid role. Allowed roles: user, admin");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserRepository.createUser({ name, email, password: hashedPassword, role });
    }

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    }
}

module.exports = new AuthService();
