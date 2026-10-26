import { useState, useEffect } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "./services/api";
import { Plus, Trash2, Search } from "lucide-react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Helper terpisah untuk refresh daftar task setelah aksi CRUD
  const refreshTasks = async () => {
    try {
      const res = await fetchTasks({ search });
      setTasks(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil tasks", err);
    }
  };

  // Fetch Tasks: Berjalan setiap kali kata kunci `search` berubah
  useEffect(() => {
    let ignore = false;
    async function getTasks() {
      try {
        const res = await fetchTasks({ search });
        if (!ignore) {
          setTasks(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil tasks", err);
      }
    }

    getTasks();

    return () => {
      ignore = true;
    };
  }, [search]);

  // Handler Tambah Task Baru (Otomatis masuk ke TODO)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        status: "TODO",
      });
      setTitle("");
      setDescription("");
      await refreshTasks();
    } catch (err) {
      console.error("Gagal membuat task", err);
    }
  };

  // Handler Update Status Task (Dipindah via Card Dropdown)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      await refreshTasks();
    } catch (err) {
      console.error("Gagal mengupdate status", err);
    }
  };

  // Handler Hapus Task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await refreshTasks();
    } catch (err) {
      console.error("Gagal menghapus task", err);
    }
  };

  const columns = [
    { key: "TODO", title: "To Do", color: "bg-yellow-50 border-yellow-200" },
    {
      key: "IN_PROGRESS",
      title: "In Progress",
      color: "bg-blue-50 border-blue-200",
    },
    { key: "DONE", title: "Done", color: "bg-green-50 border-green-200" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Task Planner</h1>
            <p className="text-slate-500 text-sm">
              Kelola dan selesaikan tugasmu dengan rapi
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </header>

        {/* Form Input Task (Simpel tanpa dropdown kategori) */}
        <form
          onSubmit={handleCreateTask}
          className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Judul task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Deskripsi singkat..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Tambah Task
          </button>
        </form>

        {/* Kolom Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className={`border rounded-xl p-4 flex flex-col min-h-100 ${col.color}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-slate-700">{col.title}</h2>
                  <span className="bg-white text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow-sm space-y-3 border"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-800">
                          {task.title}
                        </h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-slate-500 text-xs">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-end pt-2 border-t text-xs">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="bg-slate-50 border rounded px-2 py-1 text-xs text-slate-600 focus:outline-none"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="pt-8 pb-4 text-center border-t border-slate-200 mt-12">
          <p className="text-sm text-slate-500">
            Built by{" "}
            <span className="font-semibold text-slate-700">
              Fadli Ahmad Fauzi
            </span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            © {new Date().getFullYear()} Task Flow. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
