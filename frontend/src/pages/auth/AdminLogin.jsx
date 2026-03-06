import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedIdentifier = identifier.trim()
    if (!normalizedIdentifier) {
      setError('Enter your admin email or username.')
      return
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setError('')
    setIsLoading(true)

    window.setTimeout(() => {
      const isValidCredential =
        (normalizedIdentifier === 'admin@blockvote.com' ||
          normalizedIdentifier === 'admin') &&
        password === 'admin123'

      if (!isValidCredential) {
        setIsLoading(false)
        setError('Incorrect admin credentials. Please try again.')
        return
      }

      navigate('/admin/otp', {
        state: {
          adminId: normalizedIdentifier,
        },
      })
    }, 1200)
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

          <Link
            to="/"
            className="font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Home
          </Link>
        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in with your admin account. After successful login, an OTP
            will be sent to your registered email for verification.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Admin Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value)
                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Enter admin email or username"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AdminLogin
