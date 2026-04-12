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

  // ── Toggle Complete (optimistic) ──────────────────
  toggleTaskComplete: async (id) => {
    const prev = get().tasks;
    const task = prev.find((t) => t._id === id);
    if (!task) return;

    // Optimistic update
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t._id === id
          ? { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? new Date() : null }
          : t
      ),
    }));

    try {
      await taskService.toggleComplete(id);
      toast.success(task.isCompleted ? "Task uncompleted" : "Task completed!");
    } catch (err) {
      set({ tasks: prev }); // Rollback
      toast.error("Failed to update task");
    }
  },

  // ── Soft Delete (optimistic) ──────────────────────
  softDeleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
    try {
      await taskService.softDelete(id);
      toast.success("Task moved to trash");
    } catch (err) {
      set({ tasks: prev }); // Rollback
      toast.error(err.message);
    }
  },

  // ── Restore Task (optimistic) ─────────────────────
  restoreTask: async (id) => {
    const prev = get().tasks;
    const task = prev.find((t) => t._id === id);
    
    // Optimistic: add back to tasks
    if (!task) {
      // If task not in current list (from trash view), fetch it
      try {
        const res = await taskService.getById(id);
        set((s) => ({ tasks: [...s.tasks, res.data.data] }));
      } catch (err) {
        toast.error("Failed to restore task");
        return;
      }
    }

    try {
      await taskService.restore(id);
      toast.success("Task restored");
    } catch (err) {
      set({ tasks: prev }); // Rollback
      toast.error("Failed to restore task");
    }
  },

  // ── Fetch Trashed Tasks ───────────────────────────
  fetchTrashedTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getTrashed();
      set({ tasks: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load trashed tasks");
    }
  },

  // ── Empty Trash ───────────────────────────────────
  emptyTrash: async () => {
    set({ isLoading: true, error: null });
    try {
      await taskService.emptyTrash();
      set({ tasks: [], isLoading: false });
      toast.success("Trash emptied");
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to empty trash");
    }
  },

  // ── Fetch Completed Tasks ─────────────────────────
  fetchCompletedTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getCompleted();
      set({ tasks: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load completed tasks");
    }
  },

  // ── Fetch Today Tasks (overdue + today) ───────────
  fetchTodayTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getToday();
      set({ 
        overdueTasks: res.data.data.overdue || [],
        todayTasks: res.data.data.today || [],
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load today's tasks");
    }
  },

  // ── Fetch Next 7 Days Tasks ──────────────────────
  fetchNext7DaysTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getNext7Days();
      set({ 
        next7DaysTasks: res.data.data.groupedTasks || {},
        next7DaysTotal: res.data.data.total || 0,
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load next 7 days tasks");
    }
  },

  // ── Postpone Task (optimistic) ───────────────────
  postponeTask: async (id) => {
    const prev = get().tasks;
    const task = prev.find((t) => t._id === id);
    if (!task) return;

    // Optimistic: remove from overdue
    set((s) => ({
      overdueTasks: s.overdueTasks?.filter((t) => t._id !== id) || [],
    }));

    try {
      await taskService.postpone(id);
      toast.success("Task postponed to tomorrow");
    } catch (err) {
      set({ tasks: prev }); // Rollback
      toast.error("Failed to postpone task");
    }
  },

  // ── Permanent Delete (optimistic) ────────────────
  permanentDeleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
    try {
      await taskService.permanentDelete(id);
      toast.success("Task permanently deleted");
    } catch (err) {
      set({ tasks: prev }); // Rollback
      toast.error(err.message);
    }
  },

  // ── Local helpers ───────────────────────────────────
  getTaskById: (id) => get().tasks.find((t) => t._id === id),
}));

export default useTaskStore;
