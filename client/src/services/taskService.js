import api from "./api.js";

const taskService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== "all") params.append(k, v);
    });
    return api.get(`/tasks?${params.toString()}`);
  },

  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  updateSubtasks: (id, subtasks) =>
    api.patch(`/tasks/${id}/subtasks`, { subtasks }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default taskService;
