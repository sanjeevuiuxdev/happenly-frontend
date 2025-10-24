import api from './axiosConfig';

export const listEvents = (params) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);

// multipart create
export const createEvent = (formData) =>
  api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const applyEvent = (payload) => api.post('/applications', payload);
export const listApplications = (params) => api.get('/applications', { params });
export const appStats = () => api.get('/applications/stats');
