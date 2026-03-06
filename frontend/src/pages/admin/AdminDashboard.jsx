import { Link } from 'react-router-dom'

const summaryCards = [
  { label: 'Total States', value: 12, tone: 'bg-emerald-50 text-emerald-700' },
  {
    label: 'Total Constituencies',
    value: 184,
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Active Elections',
    value: 3,
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Total Candidates',
    value: 428,
    tone: 'bg-rose-50 text-rose-700',
  },
]

const quickActions = [
  { label: 'Create State', to: '/admin/states' },
  { label: 'Create Election', to: '/admin/elections/create' },
  { label: 'View Results', to: '/admin/results' },
]

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Central control panel for managing states, constituencies, elections,
          candidates, and final result publication across the E-Voting system.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <div
              className={`mt-4 inline-flex rounded-2xl px-4 py-2 text-3xl font-bold ${card.tone}`}
            >
              {card.value}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-5 flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
