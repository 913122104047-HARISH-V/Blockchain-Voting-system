import { useMemo, useState } from 'react'

const elections = [
  'Tamil Nadu General Election 2026',
  'Karnataka Assembly Election 2026',
]

const states = ['Tamil Nadu', 'Karnataka']

const constituencyMap = {
  'Tamil Nadu': ['Chennai Central', 'Coimbatore', 'Madurai'],
  Karnataka: ['Bengaluru South', 'Mysuru', 'Mangaluru'],
}

const initialCandidates = [
  {
    id: 1,
    election: 'Tamil Nadu General Election 2026',
    state: 'Tamil Nadu',
    constituency: 'Chennai Central',
    name: 'Arun Kumar',
    party: 'Progressive Party',
  },
  {
    id: 2,
    election: 'Tamil Nadu General Election 2026',
    state: 'Tamil Nadu',
    constituency: 'Coimbatore',
    name: 'Meena Ravi',
    party: 'People Front',
  },
  {
    id: 3,
    election: 'Karnataka Assembly Election 2026',
    state: 'Karnataka',
    constituency: 'Bengaluru South',
    name: 'Rohan Shetty',
    party: 'National Alliance',
  },
]

function ManageCandidates() {
  const [filters, setFilters] = useState({
    election: elections[0],
    state: states[0],
    constituency: constituencyMap[states[0]][0],
  })
  const [candidates, setCandidates] = useState(initialCandidates)
  const [form, setForm] = useState({
    name: '',
    party: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) => candidate.election === filters.election),
    [candidates, filters.election],
  )

  const handleFilterChange = (key, value) => {
    if (key === 'state') {
      setFilters((current) => ({
        ...current,
        state: value,
        constituency: constituencyMap[value][0],
      }))
      return
    }

    setFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedName = form.name.trim()
    const normalizedParty = form.party.trim()

    if (!normalizedName || !normalizedParty) {
      setError('Candidate name and party name are required.')
      setMessage('')
      return
    }

    const payload = {
      election: filters.election,
      state: filters.state,
      constituency: filters.constituency,
      name: normalizedName,
      party: normalizedParty,
    }

    if (editingId) {
      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === editingId ? { ...candidate, ...payload } : candidate,
        ),
      )
      setMessage('Candidate updated successfully.')
    } else {
      setCandidates((current) => [...current, { id: Date.now(), ...payload }])
      setMessage('Candidate added successfully.')
    }

    setForm({ name: '', party: '' })
    setEditingId(null)
    setError('')
  }

  const handleEdit = (candidate) => {
    setFilters({
      election: candidate.election,
      state: candidate.state,
      constituency: candidate.constituency,
    })
    setForm({
      name: candidate.name,
      party: candidate.party,
    })
    setEditingId(candidate.id)
    setMessage(`Editing ${candidate.name}.`)
    setError('')
  }

  const handleDelete = (id) => {
    setCandidates((current) => current.filter((candidate) => candidate.id !== id))
    setMessage('Candidate removed successfully.')
    if (editingId === id) {
      setEditingId(null)
      setForm({ name: '', party: '' })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Candidates</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add candidates to elections, assign them to constituencies, and keep
          the contest list current.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Election
            </label>
            <select
              value={filters.election}
              onChange={(event) =>
                handleFilterChange('election', event.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {elections.map((election) => (
                <option key={election} value={election}>
                  {election}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              State
            </label>
            <select
              value={filters.state}
              onChange={(event) => handleFilterChange('state', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Constituency
            </label>
            <select
              value={filters.constituency}
              onChange={(event) =>
                handleFilterChange('constituency', event.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {constituencyMap[filters.state].map((constituency) => (
                <option key={constituency} value={constituency}>
                  {constituency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form
          className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Candidate Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Enter candidate name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Party Name
            </label>
            <input
              type="text"
              value={form.party}
              onChange={(event) =>
                setForm((current) => ({ ...current, party: event.target.value }))
              }
              placeholder="Enter party name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            {editingId ? 'Update Candidate' : 'Add Candidate'}
          </button>
        </form>

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
                <th className="px-5 py-4 font-semibold">Candidate Name</th>
                <th className="px-5 py-4 font-semibold">Party</th>
                <th className="px-5 py-4 font-semibold">Constituency</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {candidate.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{candidate.party}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {candidate.constituency}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => handleEdit(candidate)}
                        className="text-amber-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(candidate.id)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageCandidates
