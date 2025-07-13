const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Application API", () => {
  let userToken, jobId, applicationId;
  beforeAll(async () => {
    // Register and login user
    const email = `user_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      firstName: "AppUser",
      lastName: "One",
      email,
      password: "password123",
      role: "user",
    });
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });
    userToken = res.body.token;

    // Create a job as recruiter
    const recruiterEmail = `recruiter_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      firstName: "Recruiter",
      lastName: "App",
      email: recruiterEmail,
      password: "password123",
      role: "recruiter",
    });
    const recruiterRes = await request(app).post("/api/auth/login").send({
      email: recruiterEmail,
      password: "password123",
    });
    const recruiterToken = recruiterRes.body.token;
    const jobRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        title: "Frontend Developer",
        company: "JobDekho",
        description: "React job",
        location: "Remote",
      });
    jobId = jobRes.body.job._id;
  });

  it("should apply for a job", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ jobId });
    expect(res.statusCode).toBe(201);
    applicationId = res.body.application._id;
  });

  it("should get user's applications", async () => {
    const res = await request(app)
      .get("/api/applications/my-applications")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.applications)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
