import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/states', label: 'Manage States' },
  { to: '/admin/constituencies', label: 'Manage Constituencies' },
  { to: '/admin/elections/create', label: 'Create Election' },
  { to: '/admin/candidates', label: 'Manage Candidates' },
  { to: '/admin/results', label: 'Election Results' },
]

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-3xl bg-slate-900 p-5 text-white shadow-sm lg:block">
      <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
        Navigation
      </p>
      <nav className="mt-5 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
