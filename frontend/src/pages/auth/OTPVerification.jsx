import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axiosInstance'

const OTP_LENGTH = 6
const INITIAL_COUNTDOWN = 30

function AdminOTPVerification() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN)
  const [error, setError] = useState('')
  const inputRefs = useRef([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state?.adminId) {
      navigate('/admin/login')
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (countdown === 0) return
    const timer = window.setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const nextOtp = [...otp]
    nextOtp[index] = digit
    setOtp(nextOtp)
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
    if (error) setError('')
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const joinedOtp = otp.join('')
    if (joinedOtp.length !== OTP_LENGTH) {
      setError('Enter the complete OTP before verification.')
      return
    }

    try {
      const { data } = await api.post('/api/auth/admin/verify', {
        email: location.state.adminId,
        otp: joinedOtp,
        faceToken: 'admin-face-token',
      })
      if (data?.token) {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin/dashboard')
      } else {
        setError('Verification failed. Try again.')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Incorrect OTP or face verification failed.')
    }
  }

  const handleResend = () => {
    if (countdown > 0) return
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    setCountdown(INITIAL_COUNTDOWN)
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">BV</div>
            <div>
              <p className="font-bold text-slate-900">BlockVote</p>
              <p className="text-sm text-slate-500">Admin OTP Verification</p>
            </div>
          </div>
          <Link to="/" className="font-medium text-slate-700 transition hover:text-emerald-600">Home</Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Admin OTP Verification</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Enter the OTP sent to your registered email address to confirm your admin identity.</p>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-12 rounded-xl border border-slate-300 text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              ))}
            </div>

            {error ? (<p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p>) : null}

            <button type="submit" className="mt-8 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700">
              Verify OTP
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Didn&apos;t receive the OTP?
              <button type="button" onClick={handleResend} disabled={countdown > 0} className="ml-2 font-semibold text-emerald-600 disabled:text-slate-400">Resend OTP</button>
            </p>
            <p className="mt-2">{countdown > 0 ? `You can resend a new OTP in ${countdown}s` : 'You can request a new OTP now.'}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminOTPVerification
