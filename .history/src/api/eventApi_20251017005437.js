// src/api/eventApi.js
import api from './axiosConfig';

export const listEvents   = (params) => api.get('/events', { params });
export const getEvent     = (id)     => api.get(`/events/${id}`);

// CREATE (multipart)
export const createEvent = (formData) =>
  api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// UPDATE (JSON or multipart — pass FormData when sending files)
export const updateEvent = (id, data) => {
  if (data instanceof FormData) {
    return api.patch(`/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.patch(`/events/${id}`, data);
};

// DELETE
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Applications (admin)
export const applyEvent = (payload) =>
  api.post('/applications', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
export const listApplications  = (params)  => api.get('/applications', { params });
export const appStats          = ()        => api.get('/applications/stats');
