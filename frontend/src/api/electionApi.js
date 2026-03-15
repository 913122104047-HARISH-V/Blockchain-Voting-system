import api from './axiosInstance'

export async function listElections(params = {}) {
  const { data } = await api.get('/api/elections', { params })
  return data
}

export async function createElection({ state_id, title, start_time, end_time, status = 'scheduled' }) {
  const { data } = await api.post('/api/elections', {
    state_id,
    title,
    start_time,
    end_time,
    status,
  })
  return data
}

export async function updateElectionStatus(id, status) {
  const { data } = await api.patch(`/api/elections/${id}/status`, { status })
  return data
}
