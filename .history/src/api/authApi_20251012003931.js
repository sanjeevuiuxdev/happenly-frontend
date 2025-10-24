import api from './axiosConfig'
export const signup = (payload) => api.post('/auth/signup', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const me = () => api.get('/auth/me')