import prisma from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Get All Tasks (support search & filter category)
export const getTasks = async (req, res) => {
  try {
    const { search, status, categoryId } = req.query;

    const where = {};
    if (search) {
      where.title = { contains: search };
    }
    if (status) {
      where.status = status;
    }
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, "Berhasil mengambil daftar task", tasks);
  } catch (error) {
    return sendError(res, "Gagal mengambil task", 500, error);
  }
};

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, categoryId, status } = req.body;

    if (!title || String(title).trim() === "") {
      return sendError(res, "Judul task wajib diisi", 400);
    }

    // Handle categoryId secara aman (konversi ke Integer jika ada)
    let catId = null;
    if (categoryId !== null && categoryId !== undefined && categoryId !== "") {
      const num = parseInt(categoryId, 10);
      if (!isNaN(num)) {
        catId = num;
      }
    }

    const newTask = await prisma.task.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        status: status || "TODO",
        categoryId: catId,
      },
      include: { category: true },
    });

    return sendSuccess(res, "Task berhasil dibuat", newTask, 201);
  } catch (error) {
    console.error("Prisma Error:", error);
    return sendError(res, "Gagal membuat task", 500, error);
  }
};
// Update Task Status / Detail
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, categoryId } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? parseInt(categoryId) : null,
        }),
      },
      include: { category: true },
    });

    return sendSuccess(res, "Task berhasil diperbarui", updatedTask);
  } catch (error) {
    return sendError(res, "Gagal memperbarui task", 500, error);
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    return sendSuccess(res, "Task berhasil dihapus");
  } catch (error) {
    return sendError(res, "Gagal menghapus task", 500, error);
  }
};
