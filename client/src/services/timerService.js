import api from './api';

const timerService = {
  // Get all timers for user
  getAll: () => {
    return api.get('/timers');
  },

  // Get single timer by ID
  getById: (id) => {
    return api.get(`/timers/${id}`);
  },

  // Create new timer
  create: (data) => {
    return api.post('/timers', data);
  },

  // Update timer
  update: (id, data) => {
    return api.patch(`/timers/${id}`, data);
  },

  // Delete timer
  delete: (id) => {
    return api.delete(`/timers/${id}`);
  },
};

export default timerService;
