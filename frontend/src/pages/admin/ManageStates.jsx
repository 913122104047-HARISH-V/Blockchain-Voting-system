import { useEffect, useState } from 'react'
import { getStates, createState } from '../../api/adminApi'

function ManageStates() {
  const [states, setStates] = useState([])
  const [stateName, setStateName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = await getStates()
        setStates(data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load states')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedName = stateName.trim()
    if (!normalizedName) {
      setError('State name is required.')
      setMessage('')
      return
    }
    try {
      setError('')
      await createState({ name: normalizedName })
      setMessage('State added successfully.')
      setStateName('')
      const fresh = await getStates()
      setStates(fresh)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add state')
      setMessage('')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage States</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add new states and maintain the list used across the election system.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="state-name" className="mb-2 block text-sm font-medium text-slate-700">
              State Name
            </label>
            <input
              id="state-name"
              type="text"
              value={stateName}
              onChange={(event) => setStateName(event.target.value)}
              placeholder="Enter state name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button type="submit" className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Add State
          </button>
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
                <th className="px-5 py-4 font-semibold">State Name</th>
                <th className="px-5 py-4 font-semibold">Total Constituencies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td className="px-5 py-4" colSpan={2}>Loading...</td></tr>
              ) : (
                states.map((state) => (
                  <tr key={state._id || state.id}>
                    <td className="px-5 py-4 font-medium text-slate-900">{state.name}</td>
                    <td className="px-5 py-4 text-slate-600">{state.total_constituencies ?? 0}</td>
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

export default ManageStates
