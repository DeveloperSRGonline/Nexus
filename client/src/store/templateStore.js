import { create } from "zustand";
import templateService from "@/services/templateService";
import toast from "react-hot-toast";

const useTemplateStore = create((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  // ── Fetch ──────────────────────────────────────────
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await templateService.getAll();
      set({ templates: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load templates");
    }
  },

  // ── Create ─────────────────────────────────────────
  createTemplate: async (data) => {
    try {
      const res = await templateService.create(data);
      set((s) => ({ templates: [res.data.data, ...s.templates] }));
      toast.success("Template created");
      return res.data.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  },

  // ── Update ─────────────────────────────────────────
  updateTemplate: async (id, updates) => {
    const prev = get().templates;
    // Optimistic
    set((s) => ({
      templates: s.templates.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    }));
    try {
      const res = await templateService.update(id, updates);
      set((s) => ({
        templates: s.templates.map((t) => (t._id === id ? res.data.data : t)),
      }));
      toast.success("Template updated");
    } catch (err) {
      set({ templates: prev });
      toast.error(err.message);
    }
  },

  // ── Delete ─────────────────────────────────────────
  deleteTemplate: async (id) => {
    const prev = get().templates;
    set((s) => ({ templates: s.templates.filter((t) => t._id !== id) }));
    try {
      await templateService.delete(id);
      toast.success("Template deleted");
    } catch (err) {
      set({ templates: prev });
      toast.error(err.message);
    }
  },

  // ── Local helpers ───────────────────────────────────
  getTemplateById: (id) => get().templates.find((t) => t._id === id),
}));

export default useTemplateStore;
