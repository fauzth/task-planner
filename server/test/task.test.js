import request from "supertest";
import express from "express";
import taskRoutes from "../src/routes/task.routes.js";

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task API Integration Tests", () => {
  it("GET /api/tasks - harus mengembalikan status 200 dan daftar task", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });

  it("POST /api/tasks - harus berhasil membuat task baru", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Task Pengujian Jest",
      description: "Dibuat otomatis lewat Supertest",
      status: "TODO",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Task Pengujian Jest");
  });
});
