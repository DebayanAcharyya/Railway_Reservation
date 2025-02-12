const prisma = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async createUser(userData) {
        return await prisma.user.create({ data: userData });
    }
}

module.exports = new UserRepository();
