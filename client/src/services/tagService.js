import api from "./api.js";

const tagService = {
  getAll: () => api.get("/tags"),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post("/tags", data),
  delete: (id) => api.delete(`/tags/${id}`),
};

export default tagService;
