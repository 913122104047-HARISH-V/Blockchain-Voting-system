import api from './axiosInstance'

export async function initVoterLogin(aadhaar_number) {
  const { data } = await api.post('/api/auth/voter/login', { aadhaar_number })
  return data
}

export async function verifyVoterOtp({ voter_id, otp, faceToken = 'voter-face-token' }) {
  const { data } = await api.post('/api/auth/voter/verify', { voter_id, otp, faceToken })
  return data
}

export async function getVoterDashboard() {
  const { data } = await api.get('/api/voter/dashboard')
  return data
}

export async function bindWallet(wallet_address) {
  const { data } = await api.post('/api/voter/bind-wallet', { wallet_address })
  return data
}
