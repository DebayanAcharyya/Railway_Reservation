const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

console.log(`Prisma connected in ${process.env.NODE_ENV} mode`); 

module.exports = prisma;
