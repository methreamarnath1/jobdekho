const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser3@example.com",
      password: "password123",
      role: "user",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
