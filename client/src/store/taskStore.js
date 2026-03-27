import { create } from "zustand";
import taskService from "@/services/taskService";
import toast from "react-hot-toast";

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // ── Fetch ──────────────────────────────────────────
  fetchTasks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getAll(filters);
      set({ tasks: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load tasks");
    }
  },

  // ── Create ─────────────────────────────────────────
  createTask: async (data) => {
    try {
      const res = await taskService.create(data);
      set((s) => ({ tasks: [res.data.data, ...s.tasks] }));
      toast.success("Task created");
      return res.data.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  },

  // ── Update ─────────────────────────────────────────
  updateTask: async (id, updates) => {
    const prev = get().tasks;
    // Optimistic
    set((s) => ({
      tasks: s.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    }));
    try {
      const res = await taskService.update(id, updates);
      set((s) => ({
        tasks: s.tasks.map((t) => (t._id === id ? res.data.data : t)),
      }));
    } catch (err) {
      set({ tasks: prev });
      toast.error(err.message);
    }
  },

  // ── Status (optimistic — kanban drag) ──────────────
  updateTaskStatus: async (id, status) => {
    const prevStatus = get().tasks.find((t) => t._id === id)?.status;
    set((s) => ({
      tasks: s.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));
    try {
      await taskService.updateStatus(id, status);
    } catch (err) {
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t._id === id ? { ...t, status: prevStatus } : t,
        ),
      }));
      toast.error("Failed to update status");
    }
  },

  // ── Delete ─────────────────────────────────────────
  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
    try {
      await taskService.delete(id);
      toast.success("Task deleted");
    } catch (err) {
      set({ tasks: prev });
      toast.error(err.message);
    }
  },

  // ── Local helpers ───────────────────────────────────
  getTaskById: (id) => get().tasks.find((t) => t._id === id),
}));

export default useTaskStore;
