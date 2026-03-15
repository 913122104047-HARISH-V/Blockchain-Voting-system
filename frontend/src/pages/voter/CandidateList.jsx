import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVoterDashboard } from '../../api/voterApi'
import { submitVoteTransaction } from '../../blockchain/voteTransaction'

function CandidateList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState({
    voter: location.state?.voter || null,
    election: location.state?.election || null,
    candidates: location.state?.candidates || [],
    walletAddress: location.state?.walletAddress || '',
  })
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('voter_token')) {
      navigate('/voter/login')
      return
    }
    if (!dashboard.voter || !dashboard.election || !dashboard.candidates.length) {
      (async () => {
        try {
          const data = await getVoterDashboard()
          setDashboard((d) => ({
            ...d,
            voter: data.voter,
            election: data.election,
            candidates: data.candidates,
            walletAddress: data.wallet_binding?.wallet_address || d.walletAddress,
          }))
        } catch (e) {
          setError(e?.response?.data?.message || 'Failed to load candidates')
        }
      })()
    }
  }, [dashboard.candidates.length, dashboard.election, dashboard.voter, navigate])

  const candidates = useMemo(() => dashboard.candidates || [], [dashboard.candidates])

  const handleVote = async () => {
    if (!selectedCandidate || !dashboard.election) {
      return
    }

    if (!window.ethereum) {
      setError('MetaMask is required to submit your vote.')
      return
    }

    setIsVoting(true)
    setError('')

    try {
      const { transactionHash } = await submitVoteTransaction({
        electionOnChainId: dashboard.election.on_chain_id,
        candidateOnChainId: selectedCandidate.on_chain_id,
      })

      navigate('/voter/vote-success', {
        state: {
          voter: dashboard.voter,
          election: dashboard.election,
          candidate: selectedCandidate,
          transactionHash,
          walletAddress: dashboard.walletAddress,
        },
      })
    } catch (transactionError) {
      setError(transactionError.message || 'Vote transaction failed.')
    } finally {
      setIsVoting(false)
      setSelectedCandidate(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Candidates for Your Constituency
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            State: {dashboard.voter?.state || ''} | Constituency: {dashboard.voter?.constituency || ''}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <article
              key={candidate._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {candidate.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {candidate.party_id?.name || 'Independent'}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {candidate.symbol || candidate.party_id?.symbol || candidate.party_id?.name || ''}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Constituency: {dashboard.voter?.constituency || ''}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(candidate)}
                className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Vote
              </button>
            </article>
          ))}
        </section>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>

      {selectedCandidate ? (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/60 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Confirm Your Vote
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You are about to vote for {selectedCandidate.name} from{' '}
              {selectedCandidate.party_id?.name || 'Independent'}. This action will be submitted through
              MetaMask to the blockchain.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVote}
                disabled={isVoting}
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {isVoting ? 'Submitting Vote...' : 'Confirm Vote'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CandidateList
