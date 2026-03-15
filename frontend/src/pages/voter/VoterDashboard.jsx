import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connectWallet } from '../../blockchain/connectWallet'
import { getVoterDashboard, bindWallet } from '../../api/voterApi'

function VoterDashboard() {
  const [dashboard, setDashboard] = useState({ voter: null, election: null, candidates: [], wallet_binding: null })
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('voter_token')) {
      navigate('/voter/login')
      return
    }
    (async () => {
      try {
        const data = await getVoterDashboard()
        setDashboard(data)
       // setWalletAddress(data.wallet_binding?.wallet_address || '')
       if (data.wallet_binding?.wallet_address) {
  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  })

            if (
              accounts.length &&
              accounts[0].toLowerCase() ===
                data.wallet_binding.wallet_address.toLowerCase()
            ) {
              setWalletAddress(accounts[0])
            }
          }
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [navigate])

  const handleConnectWallet = async () => {
    setError('')
    setIsConnecting(true)
    try {
      const account = await connectWallet()
      setWalletAddress(account)
      await bindWallet(account)
    } catch (walletError) {
      setError(walletError.message || 'Unable to connect wallet.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleViewCandidates = () => {
    navigate('/voter/candidates', {
      state: {
        voter: dashboard.voter,
        election: dashboard.election,
        candidates: dashboard.candidates,
        walletAddress,
      },
    })
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-100 p-6">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-slate-100 p-6 text-red-600">{error}</div>
  }

  if (!dashboard.voter) {
    return <div className="min-h-screen bg-slate-100 p-6">No voter data found.</div>
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
              BV
            </div>
            <div>
              <p className="font-bold text-slate-900">BlockVote</p>
              <p className="text-sm text-slate-500">Voter Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {dashboard.voter.name?.slice(0, 2).toUpperCase()}
            </div>
            <Link
              to="/"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {dashboard.voter.name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review your voting region details before participating in the active election.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">State</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {dashboard.voter.state}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Constituency</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {dashboard.voter.constituency}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Active Election
            </p>
            <h2 className="mt-4 text-3xl font-bold">{dashboard.election ? dashboard.election.title : 'No active election'}</h2>
            <p className="mt-3 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-300">
              Status: {dashboard.election ? dashboard.election.status : 'N/A'}
            </p>

            <div className="mt-8 space-y-4">
              {!walletAddress ? (
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
                    Wallet connected: {walletAddress}
                  </div>
                  {dashboard.election && (
                    <button
                      type="button"
                      onClick={handleViewCandidates}
                      className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      View Candidates
                    </button>
                  )}
                </div>
              )}

              {error ? (
                <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                  {error}
                </p>
              ) : null}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default VoterDashboard
