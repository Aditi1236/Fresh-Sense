import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getBatches    = ()           => api.get('/batches')
export const getBatch      = (id)         => api.get(`/batches/${id}`)
export const updateBatch   = (id, data)   => api.put(`/batches/${id}`, data)
export const getAlerts     = ()           => api.get('/alerts')
export const predict       = (data)       => api.post('/predict', data)
export const simulate      = (data)       => api.post('/simulate', data)
export const createBatch   = (data)       => api.post('/batches', data)

export default api
