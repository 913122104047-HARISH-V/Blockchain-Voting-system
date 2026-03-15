import api from './axiosInstance'

export async function listCandidates(params = {}) {
  const { data } = await api.get('/api/candidates', { params })
  return data
}

export async function addCandidate(payload) {
  const { data } = await api.post('/api/candidates', payload)
  return data
}
