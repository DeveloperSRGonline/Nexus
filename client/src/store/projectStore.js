import { create } from "zustand";

const useProjectStore = create((set) => ({
  projects: [],
  activeProject: null,
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (project) => set({ activeProject: project }),
  setLoading: (bool) => set({ isLoading: bool }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === id ? { ...p, ...updates } : p,
      ),
    })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p._id !== id) })),
}));

export default useProjectStore;
