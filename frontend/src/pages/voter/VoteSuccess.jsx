import { Link, useLocation } from 'react-router-dom'

function VoteSuccess() {
  const location = useLocation()
  const candidate = location.state?.candidate
  const transactionHash = location.state?.transactionHash
  const election = location.state?.election

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            BV
          </div>
          <div>
            <p className="font-bold text-slate-900">BlockVote</p>
            <p className="text-sm text-slate-500">
              Your Vote Has Been Successfully Cast
            </p>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-600">
            OK
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Vote Recorded Successfully
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Thank you for participating in the election. Your vote has been
            submitted to the blockchain and stored as a verifiable record.
          </p>

          <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-6 text-left">
            <div>
              <p className="text-sm font-medium text-slate-500">Election</p>
              <p className="mt-1 font-semibold text-slate-900">
                {election?.name || 'State Election'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Selected Candidate
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {candidate
                  ? `${candidate.name} (${candidate.party})`
                  : 'Candidate confirmed'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Blockchain Transaction ID
              </p>
              <p className="mt-1 break-all font-mono text-sm text-slate-700">
                {transactionHash || 'Transaction reference unavailable'}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-slate-600">
            Only one vote is allowed per election.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/voter/dashboard"
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Return to Dashboard
            </Link>
            <Link
              to="/"
              className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VoteSuccess
