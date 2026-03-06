import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            BV
          </div>
          <div>
            <p className="font-bold text-slate-900">BlockVote</p>
            <p className="text-sm text-slate-500">Admin Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">Admin Profile</p>
            <p className="text-xs text-slate-500">admin@blockvote.com</p>
          </div>
          <Link
            to="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
