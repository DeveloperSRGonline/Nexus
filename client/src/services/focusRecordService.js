import api from './api';

const focusRecordService = {
  // Get overview stats
  getOverview: () => {
    return api.get('/focus-records/overview');
  },

  // Get all focus records for user
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/focus-records${queryParams ? `?${queryParams}` : ''}`);
  },

  // Create focus record
  create: (data) => {
    return api.post('/focus-records', data);
  },

  // Delete focus record
  delete: (id) => {
    return api.delete(`/focus-records/${id}`);
  },
};

export default focusRecordService;
