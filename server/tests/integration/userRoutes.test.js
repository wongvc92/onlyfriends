// server/tests/integration/userRoutes.test.js
import supertest from "supertest";
import app from "../../src/index";

describe("User Routes", () => {
  it("GET /api/users/:id should return a user object", async () => {
    const res = await supertest.request(app).get("/api/users/123");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "123");
    expect(res.body).toHaveProperty("name");
  });
});
