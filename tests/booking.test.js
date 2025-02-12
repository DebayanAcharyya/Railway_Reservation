const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

describe("Bookings API Tests", () => {
  let token = "";
  let userId;
  let trainId;
  let bookingId;

  beforeAll(async () => {
    // Clean test database
    await prisma.booking.deleteMany();
    await prisma.train.deleteMany();
    await prisma.user.deleteMany();

    // Create test train with source and destination
    const train = await prisma.train.create({
      data: {
        name: "Test Express",
        source: "City A",
        destination: "City B",
        totalSeats: 5
      }
    });
    trainId = train.id;

    // Create test user
   /* const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      }
    });
    userId = user.id;*/
  });

 

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  test("Register a new user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    userId = res.body.user.id;
  });

  test("Login and get token", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    
    token = res.body.token;
    console.log("Token", token);
  });

  test("Fetch available seats", async () => {
    const res = await request(server).get(`/api/bookings/available-seats/${trainId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("availableSeats");
    expect(Array.isArray(res.body.availableSeats)).toBeTruthy();
    expect(res.body.availableSeats.length).toBe(5);
  });

  test("Book a seat successfully", async () => {
    const res = await request(server)
      .post("/api/bookings/book")
      .send({ trainId })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toHaveProperty("seatNo");
  });

  test("Prevent overbooking when full", async () => {
    // Fill the remaining seats
    for (let i = 1; i <= 4; i++) {
      await prisma.booking.create({ data: { userId, trainId, seatNo: i + 1 } });
    }

    const res = await request(server)
      .post("/api/bookings/book")
      .send({ trainId })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("No available seats");
  });

  test("Require authentication for booking", async () => {
    const res = await request(server).post("/api/bookings/book").send({ trainId });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Access denied. No token provided.");
  });

  test("Handle invalid train ID", async () => {
    const res = await request(server)
      .post("/api/bookings/book")
      .send({ trainId: 9000 })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Train not found");
  });

 
});
