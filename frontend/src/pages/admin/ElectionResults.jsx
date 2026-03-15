import { useEffect, useMemo, useState } from 'react'
import { listElections } from '../../api/electionApi'
import { getElectionResult } from '../../api/resultApi'

function ElectionResults() {
  const [elections, setElections] = useState([])
  const [selectedElectionId, setSelectedElectionId] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const e = await listElections()
        setElections(e)
        if (e.length) setSelectedElectionId(e[0]._id)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load elections')
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (!selectedElectionId) return
      try {
        const data = await getElectionResult(selectedElectionId)
        setResult(data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load results')
      }
    })()
  }, [selectedElectionId])

  const summary = useMemo(() => {
    if (!result?.winners) return []
    const totals = result.winners.reduce((acc, winner) => {
      const party = winner.party || 'Independent'
      acc[party] = (acc[party] || 0) + 1
      return acc
    }, {})
    return Object.entries(totals)
      .map(([party, seats]) => ({
        party,
        seats,
        isRulingParty: seats >= (result.majority_mark || 0),
      }))
      .sort((a, b) => b.seats - a.seats)
  }, [result])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Election Results</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review constituency-wise winners, compare party seat totals, and publish the final result summary.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <label
          htmlFor="election-results"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Select State Election
        </label>
        <div className="flex flex-col gap-4 md:flex-row">
          <select
            id="election-results"
            value={selectedElectionId}
            onChange={(event) => {
              setSelectedElectionId(event.target.value)
              setMessage('')
              setError('')
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {elections.map((election) => (
              <option key={election._id} value={election._id}>
                {election.title}
              </option>
            ))}
          </select>
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Constituency</th>
                <th className="px-5 py-4 font-semibold">Winning Candidate</th>
                <th className="px-5 py-4 font-semibold">Party</th>
                <th className="px-5 py-4 font-semibold">Total Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {result?.winners?.map((winner) => (
                <tr key={winner.constituency}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {winner.constituency}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {winner.candidate}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{winner.party || 'Independent'}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {winner.votes?.toLocaleString?.() || winner.votes || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Party Summary
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Majority mark for this election: {result?.majority_mark ?? '-'}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summary.map((party) => (
            <article
              key={party.party}
              className={`rounded-3xl border p-5 ${
                party.isRulingParty
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-sm font-medium text-slate-500">Party</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {party.party}
              </h3>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {party.seats}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {party.isRulingParty
                  ? 'Crossed the majority mark and forms the ruling party.'
                  : 'Below the majority mark.'}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ElectionResults
