import { create } from "zustand";
import tagService from "@/services/tagService";
import toast from "react-hot-toast";

const useTagStore = create((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  // ── Fetch Tags ──────────────────────────────────────────
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await tagService.getAll();
      set({ tags: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load tags");
    }
  },

  // ── Create Tag (optimistic) ─────────────────────────
  createTag: async (data) => {
    const prev = get().tags;
    let newTag = null;

    // Optimistic: add to local state immediately
    set((s) => ({
      tags: [...s.tags, { ...data, _id: `temp-${Date.now()}`, taskCount: 0 }],
    }));

    try {
      const res = await tagService.create(data);
      newTag = res.data.data;

      // Replace temp object with real data
      set((s) => ({
        tags: s.tags.map((t) => (t._id.startsWith("temp-") ? newTag : t)),
        isLoading: false,
      }));

      toast.success("Tag created");
      return newTag;
    } catch (err) {
      set({ tags: prev, error: err.message }); // Rollback
      toast.error(err.response?.data?.message || "Failed to create tag");
      return null;
    }
  },

  // ── Delete Tag (optimistic) ─────────────────────────
  deleteTag: async (id) => {
    const prev = get().tags;

    // Optimistic: remove from local state
    set((s) => ({
      tags: s.tags.filter((t) => t._id !== id),
    }));

    try {
      await tagService.delete(id);
      toast.success("Tag deleted");
    } catch (err) {
      set({ tags: prev }); // Rollback
      toast.error(err.message);
    }
  },

  // ── Local helpers ───────────────────────────────────
  getTagById: (id) => get().tags.find((t) => t._id === id),
  getTagByName: (name) => get().tags.find((t) => t.name.toLowerCase() === name.toLowerCase()),
}));

export default useTagStore;
