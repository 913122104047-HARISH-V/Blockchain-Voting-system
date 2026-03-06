import { useMemo, useState } from 'react'

const elections = [
  {
    id: 'tn-2026',
    name: 'Tamil Nadu General Election 2026',
    majorityMark: 3,
    winners: [
      {
        constituency: 'Chennai Central',
        candidate: 'Arun Kumar',
        party: 'Progressive Party',
        votes: 86540,
      },
      {
        constituency: 'Coimbatore',
        candidate: 'Meena Ravi',
        party: 'People Front',
        votes: 79110,
      },
      {
        constituency: 'Madurai',
        candidate: 'Siva Narayan',
        party: 'Progressive Party',
        votes: 74220,
      },
      {
        constituency: 'Tiruchirappalli',
        candidate: 'Deepa Lakshmi',
        party: 'Progressive Party',
        votes: 71880,
      },
    ],
  },
  {
    id: 'ka-2026',
    name: 'Karnataka Assembly Election 2026',
    majorityMark: 2,
    winners: [
      {
        constituency: 'Bengaluru South',
        candidate: 'Rohan Shetty',
        party: 'National Alliance',
        votes: 91220,
      },
      {
        constituency: 'Mysuru',
        candidate: 'Nisha Gowda',
        party: 'National Alliance',
        votes: 80400,
      },
      {
        constituency: 'Mangaluru',
        candidate: 'Farhan Ali',
        party: 'Civic Front',
        votes: 76630,
      },
    ],
  },
]

function ElectionResults() {
  const [selectedElectionId, setSelectedElectionId] = useState(elections[0].id)
  const [message, setMessage] = useState('')

  const selectedElection = elections.find(
    (election) => election.id === selectedElectionId,
  )

  const summary = useMemo(() => {
    const totals = selectedElection.winners.reduce((accumulator, winner) => {
      accumulator[winner.party] = (accumulator[winner.party] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(totals)
      .map(([party, seats]) => ({
        party,
        seats,
        isRulingParty: seats >= selectedElection.majorityMark,
      }))
      .sort((left, right) => right.seats - left.seats)
  }, [selectedElection])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Election Results</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review constituency-wise winners, compare party seat totals, and
          publish the final result summary for public view.
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
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              setMessage(
                `${selectedElection.name} results published to the public portal.`,
              )
            }
            className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Publish Results
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
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
              {selectedElection.winners.map((winner) => (
                <tr key={winner.constituency}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {winner.constituency}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {winner.candidate}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{winner.party}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {winner.votes.toLocaleString()}
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
            Majority mark for this election: {selectedElection.majorityMark}
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
