import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', withCredentials: true,
  // baseURL: import.meta.env.VITE_API_URL || 'https://happenly-backend.onrender.com', withCredentials: true,
  baseURL: 'https://happenly-backend.onrender.com',

});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
