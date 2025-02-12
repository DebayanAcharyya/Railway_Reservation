const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

describe("Booking API - Concurrency Handling", () => {
    let trainId;
    let users = []; // Store users with their tokens
    let available = 1
    beforeAll(async () => {
        // Clean test database
        await prisma.booking.deleteMany();
        await prisma.train.deleteMany();
        await prisma.user.deleteMany();
        
        // Create test train with only 1 seat (to simulate race condition)
        const train = await prisma.train.create({
            data: {
                name: "Test Express",
                source: "City A",
                destination: "City B",
                totalSeats: available //  Only 1 seat available
            }
        });
        trainId = train.id;

        //  Register 5 test users
        for (let i = 1; i <= 5; i++) {
            const resRegister = await request(server).post("/api/auth/register").send({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: "password123"
            });

            const userId = resRegister.body.user.id;

            //  Login and get JWT token for each user
            const resLogin = await request(server).post("/api/auth/login").send({
                email: `user${i}@example.com`,
                password: "password123"
            });

            const token = resLogin.body.token;

            //  Store user ID and token
            users.push({ userId, token });
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
        server.close();
    });

    test("Prevent multiple users from booking the same seat concurrently and show successful ones", async () => {
        const promises = [];

        for (let i = 0; i < users.length; i++) {
            const delay = Math.floor(Math.random() * 100);
        
        promises.push(
            new Promise(resolve => setTimeout(() => {
                request(server)
                    .post("/api/bookings/book")
                    .send({ trainId })
                    .set("Authorization", `Bearer ${users[i].token}`)
                    .end((err, res) => resolve(res));
            }, delay))
        );
        }

        const results = await Promise.all(promises);

        // Track successful and failed requests
        const success = results.filter(res => res.statusCode === 201);
        const failures = results.filter(res => res.statusCode === 400);

        // Ensure only 1 request succeeds
        expect(success.length).toBe(available);
        expect(failures.length).toBe(users.length - available);

        //  Log successful bookings
        if (success.length > 0) {
            console.log("\nSeat Successfully Booked By:");
            success.forEach(res => {
                console.log(`User ID: ${res.body.booking.userId} | Seat No: ${res.body.booking.seatNo}`);
            });
        }

        // Log failed booking attempts
        if (failures.length > 0) {
            console.log("\n Failed Booking Attempts:");
            failures.forEach((failure, index) => {
                console.log(`User ${index + 1} Failed: ${failure.body.error}`);
            });
        }
    });
});
