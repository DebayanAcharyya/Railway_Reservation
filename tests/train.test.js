const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

let adminToken = "";
let trainId = null;

describe("Train Management API Tests", () => {
    beforeAll(async () => {
        // Cleanup previous test data
        await prisma.booking.deleteMany();
        await prisma.train.deleteMany();
        await prisma.user.deleteMany();

        // Register an admin user
        const adminRes = await request(server).post("/api/auth/register").send({
            name: "Admin User",
            email: "admin@irctc.com",
            password: "adminpassword",
            role: "admin"
        });

        // Login as admin to get token
        const loginRes = await request(server).post("/api/auth/login").send({
            email: "admin@irctc.com",
            password: "adminpassword"
        });

        adminToken = loginRes.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
        server.close();
    });

    test("Admin should be able to add a train", async () => {
        const res = await request(server)
            .post("/api/trains/add")
            .set("Authorization", `Bearer ${adminToken}`)
            .set("x-api-key", process.env.ADMIN_API_KEY)
            .send({
                name: "Rajdhani Express",
                source: "Mumbai",
                destination: "Delhi",
                totalSeats: 100
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("train");
        expect(res.body.train.name).toBe("Rajdhani Express");

        trainId = res.body.train.id; // Store train ID for later tests
    });

    test("User should be able to fetch all trains", async () => {
        const res = await request(server).get("/api/trains");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("User should be able to fetch a train by ID", async () => {
        const res = await request(server).get(`/api/trains/${trainId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(trainId);
    });

    test("User should be able to search trains by source & destination", async () => {
        const res = await request(server)
            .get("/api/trains/search?source=Mumbai&destination=Delhi");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});
