const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

describe("Booking API - Concurrency Handling", () => {
    let token = "";
    let userId;
    let trainId;

    beforeAll(async () => {
        // Clean test database
        await prisma.booking.deleteMany();
        await prisma.train.deleteMany();
        await prisma.user.deleteMany();

        // Create test train
        const train = await prisma.train.create({
            data: {
                name: "Test Express",
                source: "City A",
                destination: "City B",
                totalSeats: 1 // Only 1 seat to test concurrency properly
            }
        });
        trainId = train.id;

        // Register test user
        const resRegister = await request(server).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123", 
            role: "user"
        });

        userId = resRegister.body.user.id;

        // Login and get JWT token
        const resLogin = await request(server).post("/api/auth/login").send({
            email: "test@example.com",
            password: "password123"
        });

        token = resLogin.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
        server.close();
    });

    test("Prevent multiple users from booking the same seat concurrently and show successful ones", async () => {
        const concurrentRequests = 5; // Simulate 5 users trying to book the same seat
        const promises = [];
    
        for (let i = 0; i < concurrentRequests; i++) {
            promises.push(
                request(server)
                    .post("/api/bookings/book")
                    .send({ trainId })
                    .set("Authorization", `Bearer ${token}`)
            );
        }
    
        const results = await Promise.all(promises);
    
    
        const success = results.filter(res => res.statusCode === 201);
        const failures = results.filter(res => res.statusCode === 400);
    
       
        expect(success.length).toBe(1);
        expect(failures.length).toBe(concurrentRequests - 1);
    
        
        if (success.length > 0) {
            console.log("\n🚀 Seat Successfully Booked By:");
            success.forEach(res => {
                console.log(`✅ User ID: ${res.body.booking.userId} | Seat No: ${res.body.booking.seatNo}`);
            });
        }
    
        
        if (failures.length > 0) {
            console.log("\n❌ Failed Booking Attempts:");
            failures.forEach((failure, index) => {
                console.log(`User ${index + 1} Failed: ${failure.body.error}`);
            });
        }
    });
    
});
