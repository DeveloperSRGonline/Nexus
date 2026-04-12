import api from "./api.js";

const listService = {
  getAll: () => api.get("/lists"),
  getById: (id) => api.get(`/lists/${id}`),
  create: (data) => api.post("/lists", data),
  update: (id, data) => api.patch(`/lists/${id}`, data),
  delete: (id) => api.delete(`/lists/${id}`),
  seed: () => api.get("/lists/seed"),
};

export default listService;
