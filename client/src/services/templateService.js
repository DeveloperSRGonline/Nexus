import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const templateService = {
  getAll: () => axios.get(`${API_URL}/templates`),
  getById: (id) => axios.get(`${API_URL}/templates/${id}`),
  create: (data) => axios.post(`${API_URL}/templates`, data),
  update: (id, data) => axios.patch(`${API_URL}/templates/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/templates/${id}`),
};

export default templateService;
