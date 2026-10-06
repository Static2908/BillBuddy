import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('billbuddy_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
}

export const billsApi = {
  list: (params) => api.get('/api/bills', { params }),
  get: (id) => api.get(`/api/bills/${id}`),
  create: (payload) => api.post('/api/bills', payload),
  update: (id, payload) => api.put(`/api/bills/${id}`, payload),
  remove: (id) => api.delete(`/api/bills/${id}`),
  updateStatus: (id, status) => api.patch(`/api/bills/${id}/status`, { status }),
  addLineItem: (billId, payload) => api.post(`/api/bills/${billId}/line-items`, payload),
  updateLineItem: (billId, itemId, payload) => api.put(`/api/bills/${billId}/line-items/${itemId}`, payload),
  removeLineItem: (billId, itemId) => api.delete(`/api/bills/${billId}/line-items/${itemId}`),
}

export const analyticsApi = {
  summary: (params) => api.get('/api/analytics/summary', { params }),
  compare: (id, previousBillId) => api.get(`/api/bills/${id}/comparison`, { params: { previousBillId } }),
}

export default api
