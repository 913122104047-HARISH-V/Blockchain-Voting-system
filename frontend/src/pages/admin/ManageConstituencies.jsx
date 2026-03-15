import { useEffect, useMemo, useState } from 'react'
import { getStates, getConstituencies, createConstituency } from '../../api/adminApi'

function ManageConstituencies() {
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [constituencies, setConstituencies] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const s = await getStates()
        setStates(s)
        if (s.length) {
          setSelectedState(s[0]._id)
        }
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load states')
      }
    })()
  }, [])

  useEffect(() => {
    if (!selectedState) return
    ;(async () => {
      setLoading(true)
      try {
        const data = await getConstituencies({ state_id: selectedState })
        setConstituencies(data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load constituencies')
      } finally {
        setLoading(false)
      }
    })()
  }, [selectedState])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedState || !name.trim()) {
      setError('Select a state and enter constituency name')
      return
    }
    try {
      setError('')
      await createConstituency({ state_id: selectedState, name: name.trim() })
      setMessage('Constituency added successfully.')
      setName('')
      const data = await getConstituencies({ state_id: selectedState })
      setConstituencies(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add constituency')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Constituencies</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Add constituencies under each state.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div>
          <label htmlFor="state" className="mb-2 block text-sm font-medium text-slate-700">Select State</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {states.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Constituency Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter constituency name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button type="submit" className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">Add Constituency</button>
        </form>

        {message ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Constituency Name</th>
                <th className="px-5 py-4 font-semibold">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td className="px-5 py-4" colSpan={2}>Loading...</td></tr>
              ) : (
                constituencies.map((c) => (
                  <tr key={c._id}>
                    <td className="px-5 py-4 font-medium text-slate-900">{c.name}</td>
                    <td className="px-5 py-4 text-slate-600">{states.find((s) => s._id === c.state_id)?.name || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageConstituencies
