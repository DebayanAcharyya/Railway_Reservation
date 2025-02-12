const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

describe("Booking API Tests", () => {
  beforeAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.train.deleteMany();
    await prisma.user.deleteMany();

    // Create test train
    await prisma.train.create({
      data: { id: 1, name: "Express", source: "A", destination: "B", totalSeats: 5 },
    });

    // Create test user
    await prisma.user.create({
      data: { id: 1, name: "Test User", email: "test@example.com", password: "password123" },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  let token = "";

  test("Login and get token", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Fetch available seats", async () => {
    const res = await request(server).get("/api/bookings/1/seats");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.availableSeats)).toBeTruthy();
  });

  test("Book a seat successfully", async () => {
    const res = await request(server)
      .post("/api/bookings/create")
      .send({ trainId: 1 })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toHaveProperty("seatNo");
  });

  test("Prevent overbooking when full", async () => {
    for (let i = 1; i <= 4; i++) {
      await prisma.booking.create({ data: { userId: 1, trainId: 1, seatNo: i + 1 } });
    }

    const res = await request(server)
      .post("/api/bookings/create")
      .send({ trainId: 1 })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("No available seats on this train");
  });

  test("Require authentication for booking", async () => {
    const res = await request(server).post("/api/bookings/create").send({ trainId: 1 });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  test("Handle invalid train ID", async () => {
    const res = await request(server)
      .post("/api/bookings/create")
      .send({ trainId: "invalid_id" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid train ID");
  });
});
