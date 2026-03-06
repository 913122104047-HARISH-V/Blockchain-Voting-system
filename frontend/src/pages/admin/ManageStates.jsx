import { useState } from 'react'

const initialStates = [
  { id: 1, name: 'Tamil Nadu', constituencies: 39 },
  { id: 2, name: 'Karnataka', constituencies: 28 },
  { id: 3, name: 'Kerala', constituencies: 20 },
]

function ManageStates() {
  const [states, setStates] = useState(initialStates)
  const [stateName, setStateName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const resetForm = () => {
    setStateName('')
    setEditingId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedName = stateName.trim()
    if (!normalizedName) {
      setError('State name is required.')
      setMessage('')
      return
    }

    const duplicate = states.find(
      (state) =>
        state.name.toLowerCase() === normalizedName.toLowerCase() &&
        state.id !== editingId,
    )

    if (duplicate) {
      setError('This state already exists.')
      setMessage('')
      return
    }

    if (editingId) {
      setStates((current) =>
        current.map((state) =>
          state.id === editingId ? { ...state, name: normalizedName } : state,
        ),
      )
      setMessage('State updated successfully.')
    } else {
      setStates((current) => [
        ...current,
        {
          id: Date.now(),
          name: normalizedName,
          constituencies: 0,
        },
      ])
      setMessage('State added successfully.')
    }

    setError('')
    resetForm()
  }

  const handleEdit = (state) => {
    setStateName(state.name)
    setEditingId(state.id)
    setMessage(`Editing ${state.name}.`)
    setError('')
  }

  const handleDelete = (id) => {
    setStates((current) => current.filter((state) => state.id !== id))
    setMessage('State deleted successfully.')
    if (editingId === id) {
      resetForm()
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
        <form
          className="grid gap-4 md:grid-cols-[1fr_auto]"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="state-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
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
          <button
            type="submit"
            className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            {editingId ? 'Update State' : 'Add State'}
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
                <th className="px-5 py-4 font-semibold">State Name</th>
                <th className="px-5 py-4 font-semibold">Total Constituencies</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {states.map((state) => (
                <tr key={state.id}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {state.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {state.constituencies}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-3 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() =>
                          setMessage(
                            `${state.name} currently has ${state.constituencies} constituencies.`,
                          )
                        }
                        className="text-sky-700"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(state)}
                        className="text-amber-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(state.id)}
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

export default ManageStates
