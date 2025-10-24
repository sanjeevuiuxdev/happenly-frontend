import api from './axiosConfig'
export const listEvents = (params) => api.get('/events', { params })
export const getEvent = (id) => api.get(`/events/${id}`)
export const createEvent = (data) => api.post('/events', data)
export const applyEvent = (payload) => api.post('/applications', payload)