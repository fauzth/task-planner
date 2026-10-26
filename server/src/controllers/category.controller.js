import prisma from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return sendSuccess(res, "Berhasil mengambil daftar kategori", categories);
  } catch (error) {
    return sendError(res, "Gagal mengambil kategori", 500, error);
  }
};
