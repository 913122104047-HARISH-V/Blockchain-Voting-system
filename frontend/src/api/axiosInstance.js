import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token')
  const voterToken = localStorage.getItem('voter_token')
  // Prefer admin token when both are present to avoid sending voter token to admin APIs
  const token = adminToken || voterToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
