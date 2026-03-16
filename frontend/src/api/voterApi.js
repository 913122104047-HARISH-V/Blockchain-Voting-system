import api from './axiosInstance'

export async function initVoterLogin(aadhaar_number) {
  const { data } = await api.post('/api/auth/voter/login', { aadhaar_number })
  return data
}

export async function verifyVoterOtp({ voter_id, otp, faceToken = 'voter-face-token' }) {
  const { data } = await api.post('/api/auth/voter/verify', { voter_id, otp, faceToken })
  return data
}

export async function getVoterDashboard(voter_id) {
  const id = voter_id || localStorage.getItem('voter_id')
  const params = id ? { params: { voter_id: id } } : undefined
  const { data } = await api.get('/api/voter/dashboard', params)
  return data
}

export async function bindWallet(wallet_address) {
  const voter_id = localStorage.getItem('voter_id')
  const { data } = await api.post('/api/voter/bind-wallet', { wallet_address, voter_id })
  return data
}
