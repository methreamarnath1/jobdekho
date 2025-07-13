const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Admin API", () => {
  let adminToken;
  beforeAll(async () => {
    // Register and login admin
    const email = `admin_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      firstName: "Admin",
      lastName: "One",
      email,
      password: "password123",
      role: "admin",
    });
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });
    adminToken = res.body.token;
  });

  it("should get dashboard statistics", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userCount");
    expect(res.body).toHaveProperty("jobCount");
    expect(res.body).toHaveProperty("applicationCount");
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
