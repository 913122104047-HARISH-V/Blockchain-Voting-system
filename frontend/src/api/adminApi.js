import api from './axiosInstance'

export async function getStates() {
  const { data } = await api.get('/api/admin/states')
  return data
}

export async function createState({ name }) {
  const { data } = await api.post('/api/admin/states', { name })
  return data
}

export async function getConstituencies(params = {}) {
  const { data } = await api.get('/api/admin/constituencies', { params })
  return data
}

export async function createConstituency({ state_id, name, total_voters }) {
  const { data } = await api.post('/api/admin/constituencies', {
    state_id,
    name,
    total_voters,
  })
  return data
}

export async function listParties(params = {}) {
  const { data } = await api.get('/api/admin/parties', { params })
  return data
}

export async function createParty({ election_id, name, symbol }) {
  const { data } = await api.post('/api/admin/parties', { election_id, name, symbol })
  return data
}
