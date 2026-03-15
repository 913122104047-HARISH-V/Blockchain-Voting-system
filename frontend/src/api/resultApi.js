import api from './axiosInstance'

export async function getElectionResult(electionId) {
  const { data } = await api.get(`/api/results/election/${electionId}`)
  return data
}
