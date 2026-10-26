import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./src/routes/task.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Best Practice: Batasi CORS ke origin Frontend Vite (lokal)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes); // <-- Tambahkan ini
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Task Planner API Status: OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
