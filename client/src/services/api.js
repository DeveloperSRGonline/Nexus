import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Clerk token inject karna — useAuth hook se bahar kaam nahi karta
// isliye window.__clerk_token set karenge App.jsx se
api.interceptors.request.use(async (config) => {
  const token = window.__nexus_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;