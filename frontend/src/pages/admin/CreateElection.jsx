import { useEffect, useState } from 'react'
import { getStates } from '../../api/adminApi'
import { createElection, listElections, updateElectionStatus } from '../../api/electionApi'

function CreateElection() {
  const [states, setStates] = useState([])
  const [form, setForm] = useState({ state_id: '', name: '' })
  const [elections, setElections] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const s = await getStates()
        setStates(s)
        if (s.length) {
          setForm((f) => ({ ...f, state_id: s[0]._id }))
        }
        const e = await listElections()
        setElections(e)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load states')
      }
    })()
  }, [])

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!form.state_id || !form.name.trim()) {
      setError('State and election name are required.')
      return
    }
    try {
      await createElection({
        state_id: form.state_id,
        title: form.name.trim(),
        status: 'scheduled',
      })
      const refreshed = await listElections()
      setElections(refreshed)
      setMessage('Election created and scheduled. Add candidates, then start it when ready.')
      setForm((f) => ({ ...f, name: '' }))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create election')
    }
  }

  const handleStart = async (id) => {
    setMessage('')
    setError('')
    try {
      await updateElectionStatus(id, 'active')
      const refreshed = await listElections()
      setElections(refreshed)
      setMessage('Election started successfully.')
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to start election')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create State Election</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Start a new election for a specific state.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="election-state" className="mb-2 block text-sm font-medium text-slate-700">State Selection</label>
            <select
              id="election-state"
              value={form.state_id}
              onChange={(e) => handleChange('state_id', e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {states.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="election-name" className="mb-2 block text-sm font-medium text-slate-700">Election Name</label>
            <input
              id="election-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter election name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2 rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700">
            Elections now auto-run for 24 hours, starting 5 minutes after creation. No date selection needed.
          </div>

          <button type="submit" className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 md:col-span-2 md:justify-self-start">Create Election</button>
        </form>

        {message ? (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
            <p>{message}</p>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-4 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Existing Elections</h2>
            <p className="text-sm text-slate-600">Start an election after candidates are added.</p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">State</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {elections.map((el) => (
                  <tr key={el._id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{el.title}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {states.find((s) => s._id === el.state_id)?.name || el.state_id}
                    </td>
                    <td className="px-5 py-3 text-slate-600 capitalize">{el.status}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => handleStart(el._id)}
                        disabled={el.status === 'active'}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {el.status === 'active' ? 'Active' : 'Start Election'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!elections.length ? (
                  <tr>
                    <td className="px-5 py-4 text-slate-500" colSpan={4}>
                      No elections created yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreateElection
