import { useMemo, useState } from 'react'

const states = ['Tamil Nadu', 'Karnataka', 'Kerala']

const initialConstituencies = [
  { id: 1, name: 'Chennai Central', state: 'Tamil Nadu' },
  { id: 2, name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 3, name: 'Bengaluru South', state: 'Karnataka' },
  { id: 4, name: 'Mysuru', state: 'Karnataka' },
  { id: 5, name: 'Thiruvananthapuram', state: 'Kerala' },
]

function ManageConstituencies() {
  const [selectedState, setSelectedState] = useState(states[0])
  const [constituencies, setConstituencies] = useState(initialConstituencies)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const visibleConstituencies = useMemo(
    () =>
      constituencies.filter(
        (constituency) => constituency.state === selectedState,
      ),
    [constituencies, selectedState],
  )

  const majorityMark = Math.floor(visibleConstituencies.length / 2) + 1

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedName = name.trim()
    if (!selectedState) {
      setError('Select a state first.')
      setMessage('')
      return
    }

    if (!normalizedName) {
      setError('Constituency name is required.')
      setMessage('')
      return
    }

    if (editingId) {
      setConstituencies((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, name: normalizedName, state: selectedState }
            : item,
        ),
      )
      setMessage('Constituency updated successfully.')
    } else {
      setConstituencies((current) => [
        ...current,
        { id: Date.now(), name: normalizedName, state: selectedState },
      ])
      setMessage('Constituency added successfully.')
    }

    setError('')
    setName('')
    setEditingId(null)
  }

  const handleEdit = (constituency) => {
    setSelectedState(constituency.state)
    setName(constituency.name)
    setEditingId(constituency.id)
    setMessage(`Editing ${constituency.name}.`)
    setError('')
  }

  const handleDelete = (id) => {
    setConstituencies((current) => current.filter((item) => item.id !== id))
    setMessage('Constituency deleted successfully.')
    if (editingId === id) {
      setName('')
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Manage Constituencies
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add and maintain constituencies under each state. Majority mark is
          calculated automatically from the selected state&apos;s constituency
          count.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div>
            <label
              htmlFor="state"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Select State
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <form
            className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="constituency"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Constituency Name
              </label>
              <input
                id="constituency"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter constituency name"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button
              type="submit"
              className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {editingId ? 'Update Constituency' : 'Add Constituency'}
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
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
            Majority Mark
          </p>
          <p className="mt-4 text-5xl font-bold">{majorityMark}</p>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Based on {visibleConstituencies.length} constituencies in{' '}
            {selectedState}, a party must win at least {majorityMark}{' '}
            constituencies to hold a majority.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Constituency Name</th>
                <th className="px-5 py-4 font-semibold">State</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleConstituencies.map((constituency) => (
                <tr key={constituency.id}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {constituency.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {constituency.state}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => handleEdit(constituency)}
                        className="text-amber-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(constituency.id)}
                        className="text-red-600"
                      >
                        Delete
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

export default ManageConstituencies
