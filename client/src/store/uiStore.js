import { create } from "zustand";
import { VIEW_MODES } from "@/constants/viewModes";

const useUIStore = create((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  sidebarOpen: false, // mobile
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeMobileSidebar: () => set({ sidebarOpen: false }),

  // View mode (persisted in localStorage separately)
  viewMode: VIEW_MODES.LIST,
  setViewMode: (mode) => set({ viewMode: mode }),

  // Search
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  // Task filters
  filters: {
    status: "all",
    priority: "all",
    project: null,
    dueDate: null,
  },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () =>
    set({
      filters: { status: "all", priority: "all", project: null, dueDate: null },
    }),
}));

export default useUIStore;
