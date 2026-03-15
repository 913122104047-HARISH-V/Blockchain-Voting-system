import { useEffect, useState } from 'react'
import { listElections } from '../../api/electionApi'
import { getStates, getConstituencies, listParties, createParty } from '../../api/adminApi'
import { listCandidates, addCandidate } from '../../api/candidateApi'

function ManageCandidates() {
  const [states, setStates] = useState([])
  const [elections, setElections] = useState([])
  const [filters, setFilters] = useState({ election: '', state: '', constituency: '', party: '' })
  const [form, setForm] = useState({ name: '' })
  const [constituencies, setConstituencies] = useState([])
  const [candidates, setCandidates] = useState([])
  const [parties, setParties] = useState([])
  const [partyForm, setPartyForm] = useState({ name: '', symbol: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    (async () => {
      try {
        const s = await getStates()
        setStates(s)
        const e = await listElections()
        setElections(e)
        if (e.length) setFilters((f) => ({ ...f, election: e[0]._id }))
        if (s.length) setFilters((f) => ({ ...f, state: s[0]._id }))
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load initial data')
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (!filters.state) return
      try {
        const cs = await getConstituencies({ state_id: filters.state })
        setConstituencies(cs)
        if (cs.length) setFilters((f) => ({ ...f, constituency: cs[0]._id }))
      } catch (e) {}
    })()
  }, [filters.state])

  useEffect(() => {
    (async () => {
      if (!filters.election) return
      try {
        const list = await listCandidates({ election_id: filters.election })
        setCandidates(list)
      } catch (e) {}
    })()
  }, [filters.election])

  useEffect(() => {
    (async () => {
      if (!filters.election) return
      try {
        const ps = await listParties({ election_id: filters.election })
        setParties(ps)
        if (ps.length) setFilters((f) => ({ ...f, party: ps[0]._id }))
        else setFilters((f) => ({ ...f, party: '' }))
      } catch (e) {}
    })()
  }, [filters.election])

  const handleFilterChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (!filters.election || !filters.constituency || !filters.party || !form.name.trim()) {
      setError('Election, constituency, party, and candidate name are required.')
      return
    }
    try {
      await addCandidate({
        election_id: filters.election,
        constituency_id: filters.constituency,
        name: form.name.trim(),
        party_id: filters.party,
      })
      setMessage('Candidate added successfully.')
      setForm({ name: '' })
      const list = await listCandidates({ election_id: filters.election })
      setCandidates(list)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add candidate')
    }
  }

  const handleCreateParty = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (!filters.election || !partyForm.name.trim()) {
      setError('Election and party name are required.')
      return
    }
    try {
      await createParty({
        election_id: filters.election,
        name: partyForm.name.trim(),
        symbol: partyForm.symbol.trim() || partyForm.name.trim(),
      })
      setPartyForm({ name: '', symbol: '' })
      const ps = await listParties({ election_id: filters.election })
      setParties(ps)
      if (ps.length) setFilters((f) => ({ ...f, party: ps[0]._id }))
      setMessage('Party created successfully.')
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create party')
    }
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Candidates</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create parties per election, then add candidates mapped to those parties and constituencies.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Election</label>
            <select value={filters.election} onChange={(e) => handleFilterChange('election', e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              {elections.map((el) => (
                <option key={el._id} value={el._id}>{el.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
            <select value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              {states.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Constituency</label>
            <select value={filters.constituency} onChange={(e) => handleFilterChange('constituency', e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              {constituencies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Party</label>
            <select value={filters.party} onChange={(e) => handleFilterChange('party', e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              {parties.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {!parties.length ? <p className="mt-2 text-xs text-amber-600">Create a party for this election to add candidates.</p> : null}
          </div>
        </div>


        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Candidate Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter candidate name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </div>
          <button type="submit" className="self-end rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700" disabled={!parties.length}>Add Candidate</button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900">Create Party for this Election</h3>
          <form className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleCreateParty}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Party Name</label>
              <input type="text" value={partyForm.name} onChange={(e) => setPartyForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter party name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Symbol (optional)</label>
              <input type="text" value={partyForm.symbol} onChange={(e) => setPartyForm((f) => ({ ...f, symbol: e.target.value }))} placeholder="Symbol defaults to party name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <button type="submit" className="self-end rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Create Party</button>
          </form>
        </div>

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
                <th className="px-5 py-4 font-semibold">Candidate Name</th>
                <th className="px-5 py-4 font-semibold">Party</th>
                <th className="px-5 py-4 font-semibold">Constituency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {candidates.map((c) => (
                <tr key={c._id}>
                  <td className="px-5 py-4 font-medium text-slate-900">{c.name}</td>
                  <td className="px-5 py-4 text-slate-600">{c.party_id?.name || parties.find((p) => p._id === c.party_id)?.name || ''}</td>
                  <td className="px-5 py-4 text-slate-600">{constituencies.find((x) => x._id === c.constituency_id)?.name || ''}</td>
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
