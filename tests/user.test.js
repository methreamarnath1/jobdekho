const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("User API", () => {
  let token;
  beforeAll(async () => {
    // Register and login to get token
    const email = `user_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      firstName: "Test",
      lastName: "User",
      email,
      password: "password123",
      role: "user",
    });
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });
    token = res.body.token;
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Updated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstName).toBe("Updated");
  });

  it("should add a skill", async () => {
    const res = await request(app)
      .post("/api/users/profile/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ skill: "Node.js" });
    expect(res.statusCode).toBe(200);
    expect(res.body.skills).toContain("Node.js");
  });

  it("should remove a skill", async () => {
    const res = await request(app)
      .delete("/api/users/skills/Node.js")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.skills).not.toContain("Node.js");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
