import api from "./api.js";

const habitService = {
  getAll: () => api.get("/habits"),
  getToday: () => api.get("/habits/today"),
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post("/habits", data),
  update: (id, data) => api.patch(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  toggleCheckIn: (id, date) => api.post(`/habits/${id}/check-in`, { date }),
  setLogNote: (logId, note) => api.patch(`/habits/logs/${logId}/note`, { note }),
  getStats: (id) => api.get(`/habits/${id}/stats`),
};

export default habitService;
