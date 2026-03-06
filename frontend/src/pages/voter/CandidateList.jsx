import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const fallbackVoter = {
  state: 'Tamil Nadu',
  constituency: 'Chennai Central',
}

const allCandidates = [
  {
    id: 1,
    name: 'Arun Kumar',
    party: 'Progressive Party',
    symbol: 'Hand',
    constituency: 'Chennai Central',
    state: 'Tamil Nadu',
  },
  {
    id: 2,
    name: 'Meera Sharma',
    party: 'People Front',
    symbol: 'Lotus',
    constituency: 'Chennai Central',
    state: 'Tamil Nadu',
  },
  {
    id: 3,
    name: 'David Raj',
    party: 'Unity Congress',
    symbol: 'Cycle',
    constituency: 'Chennai Central',
    state: 'Tamil Nadu',
  },
]

function CandidateList() {
  const location = useLocation()
  const navigate = useNavigate()
  const voter = location.state?.voter || fallbackVoter
  const election = location.state?.election || {
    name: 'Tamil Nadu General Election 2026',
  }
  const walletAddress = location.state?.walletAddress || ''

  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState('')

  const candidates = useMemo(
    () =>
      allCandidates.filter(
        (candidate) =>
          candidate.state === voter.state &&
          candidate.constituency === voter.constituency,
      ),
    [voter.constituency, voter.state],
  )

  const handleVote = async () => {
    if (!selectedCandidate) {
      return
    }

    if (!window.ethereum) {
      setError('MetaMask is required to submit your vote.')
      return
    }

    setIsVoting(true)
    setError('')

    try {
      const [from] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: from,
            value: '0x0',
            data: `0x${selectedCandidate.id.toString(16)}`,
          },
        ],
      })

      navigate('/voter/vote-success', {
        state: {
          voter,
          election,
          candidate: selectedCandidate,
          transactionHash,
          walletAddress: walletAddress || from,
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
            State: {voter.state} | Constituency: {voter.constituency}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {candidate.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {candidate.party}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {candidate.symbol}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Constituency: {candidate.constituency}
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
              {selectedCandidate.party}. This action will be submitted through
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
