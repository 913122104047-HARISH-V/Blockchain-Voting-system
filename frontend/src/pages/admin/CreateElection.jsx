import { useState } from 'react'
import { Link } from 'react-router-dom'

const states = ['Tamil Nadu', 'Karnataka', 'Kerala']

function CreateElection() {
  const [form, setForm] = useState({
    state: states[0],
    name: '',
    startDate: '',
    endDate: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.startDate || !form.endDate) {
      setError('Complete all election details before creation.')
      setMessage('')
      return
    }

    if (form.endDate < form.startDate) {
      setError('Election end date must be after the start date.')
      setMessage('')
      return
    }

    setError('')
    setMessage(
      `${form.name} for ${form.state} has been created successfully. You can now proceed to add candidates.`,
    )
    setForm({
      state: form.state,
      name: '',
      startDate: '',
      endDate: '',
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Create State Election
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start a new election for a specific state and define its active
          schedule before candidate registration.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="election-state"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              State Selection
            </label>
            <select
              id="election-state"
              value={form.state}
              onChange={(event) => handleChange('state', event.target.value)}
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
            <label
              htmlFor="election-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Election Name
            </label>
            <input
              id="election-name"
              type="text"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Enter election name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Election Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={form.startDate}
              onChange={(event) => handleChange('startDate', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Election End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={form.endDate}
              onChange={(event) => handleChange('endDate', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 md:col-span-2 md:justify-self-start"
          >
            Create Election
          </button>
        </form>

        {message ? (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
            <p>{message}</p>
            <Link
              to="/admin/candidates"
              className="mt-3 inline-block underline"
            >
              Proceed to Manage Candidates
            </Link>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-4 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  )
}

export default CreateElection
