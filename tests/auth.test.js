const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

describe("Auth API Tests", () => {
  beforeAll(async () => {
    // Cleanup existing test users
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  let token = "";

  test("Register a new user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  test("Login with valid credentials", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Login with incorrect password", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  test("Login with non-existing user", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "unknown@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });
});
