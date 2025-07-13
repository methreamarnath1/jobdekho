const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Job API", () => {
  let recruiterToken, jobId;
  beforeAll(async () => {
    // Register and login recruiter
    const email = `recruiter_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      firstName: "Recruiter",
      lastName: "One",
      email,
      password: "password123",
      role: "recruiter",
    });
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });
    recruiterToken = res.body.token;
  });

  it("should create a job", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        title: "Backend Developer",
        company: "JobDekho",
        description: "Node.js backend job",
        location: "Remote",
      });
    expect(res.statusCode).toBe(201);
    jobId = res.body.job._id;
  });

  it("should get all jobs", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });

  it("should update a job", async () => {
    const res = await request(app)
      .put(`/api/jobs/${jobId}`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ title: "Updated Backend Developer" });
    expect(res.statusCode).toBe(200);
    expect(res.body.job.title).toBe("Updated Backend Developer");
  });

  it("should delete a job", async () => {
    const res = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
