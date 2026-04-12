import api from "./api.js";

const taskService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== "all") params.append(k, v);
    });
    return api.get(`/tasks?${params.toString()}`);
  },

  getByList: (listId = null) => {
    const params = new URLSearchParams();
    if (listId) params.append("listId", listId);
    return api.get(`/tasks?${params.toString()}`);
  },

  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  
  toggleComplete: (id) => api.patch(`/tasks/${id}/toggle-complete`),
  
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  updateSubtasks: (id, subtasks) =>
    api.patch(`/tasks/${id}/subtasks`, { subtasks }),
  
  softDelete: (id) => api.patch(`/tasks/${id}/soft-delete`),
  restore: (id) => api.patch(`/tasks/${id}/restore`),
  
  getTrashed: () => api.get("/tasks/trash"),
  permanentDelete: (id) => api.delete(`/tasks/${id}/permanent`),
  emptyTrash: () => api.delete("/tasks/trash/empty"),
  
  getCompleted: () => api.get("/tasks/completed"),

  getToday: () => api.get("/tasks/today"),
  getNext7Days: () => api.get("/tasks/next-7-days"),
  postpone: (id) => api.patch(`/tasks/${id}/postpone`),

  search: (query, page = 1, limit = 20) =>
    api.get(`/tasks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
  
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default taskService;
