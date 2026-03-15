import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initVoterLogin } from '../../api/voterApi'

function AadhaarLogin() {
  const [aadhaar, setAadhaar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalized = aadhaar.replace(/\s+/g, '')
    const isValid = /^\d{12}$/.test(normalized)

    if (!isValid) {
      setError('Enter a valid 12-digit Aadhaar number.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const data = await initVoterLogin(normalized)
      navigate('/voter/otp', {
        state: {
          aadhaar: normalized,
          voter_id: data.voter_id,
          otp_for_demo: data.otp_for_demo,
        },
      })
    } catch (e) {
      console.log(e);
      setError(e?.response?.data?.message || 'Unable to start voter login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
              BV
            </div>
            <div>
              <p className="font-bold text-slate-900">BlockVote</p>
              <p className="text-sm text-slate-500">E-Voting System</p>
            </div>
          </div>

          <Link to="/" className="font-medium text-slate-700 hover:text-emerald-600">
            Home
          </Link>
        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Voter Login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your Aadhaar number to begin secure verification. After
            validation, an OTP will be sent to your registered email or mobile
            number.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="aadhaar"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Aadhaar Number
              </label>
              <input
                id="aadhaar"
                type="text"
                inputMode="numeric"
                maxLength={12}
                value={aadhaar}
                onChange={(event) => {
                  setAadhaar(event.target.value.replace(/\D/g, ''))
                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              {error ? (
                <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AadhaarLogin
