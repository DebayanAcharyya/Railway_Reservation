const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
require('dotenv').config();

class AuthService {
    async register(name, email, password) {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserRepository.createUser({ name, email, password: hashedPassword });
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
