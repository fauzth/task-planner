import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://task-planner-xi-olive.vercel.app/api",
});

export const fetchCategories = () => API.get("/categories");
export const fetchTasks = (params) => API.get("/tasks", { params });
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id} `, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
