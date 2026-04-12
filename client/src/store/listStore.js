import { create } from "zustand";
import listService from "@/services/listService";
import toast from "react-hot-toast";

const useListStore = create((set, get) => ({
  lists: [],
  isLoading: false,
  error: null,

  // ── Fetch Lists ──────────────────────────────────────────
  fetchLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await listService.getAll();
      set({ lists: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load lists");
    }
  },

  // ── Create List (optimistic) ─────────────────────────
  createList: async (data) => {
    const prev = get().lists;
    let newList = null;

    // Optimistic: add to local state immediately
    set((s) => ({
      lists: [...s.lists, { ...data, _id: `temp-${Date.now()}` }],
    }));

    try {
      const res = await listService.create(data);
      newList = res.data.data;

      // Replace temp object with real data
      set((s) => ({
        lists: s.lists.map((l) => (l._id.startsWith("temp-") ? newList : l)),
        isLoading: false,
      }));

      toast.success("List created");
      return newList;
    } catch (err) {
      set({ lists: prev, error: err.message }); // Rollback
      toast.error(err.message);
      return null;
    }
  },

  // ── Update List (optimistic) ─────────────────────────
  updateList: async (id, updates) => {
    const prev = get().lists;

    // Optimistic update
    set((s) => ({
      lists: s.lists.map((l) => (l._id === id ? { ...l, ...updates } : l)),
    }));

    try {
      await listService.update(id, updates);
      toast.success("List updated");
    } catch (err) {
      set({ lists: prev }); // Rollback
      toast.error("Failed to update list");
    }
  },

  // ── Delete List (optimistic) ─────────────────────────
  deleteList: async (id) => {
    const prev = get().lists;
    const listToDelete = prev.find((l) => l._id === id);

    // Can't delete system lists
    if (listToDelete?.isSystem) {
      toast.error("Cannot delete system lists");
      return;
    }

    // Optimistic: remove from local state
    set((s) => ({
      lists: s.lists.filter((l) => l._id !== id),
    }));

    try {
      await listService.delete(id);
      toast.success("List deleted");
    } catch (err) {
      set({ lists: prev }); // Rollback
      toast.error(err.message);
    }
  },

  // ── Seed Default Lists ───────────────────────────────
  seedDefaultLists: async () => {
    try {
      const res = await listService.seed();
      set({ lists: res.data.data });
    } catch (err) {
      toast.error("Failed to seed lists");
    }
  },

  // ── Local helpers ───────────────────────────────────
  getListById: (id) => get().lists.find((l) => l._id === id),
  getListNameById: (id) => {
    const list = get().lists.find((l) => l._id === id);
    return list ? list.name : "Unknown";
  },
}));

export default useListStore;
