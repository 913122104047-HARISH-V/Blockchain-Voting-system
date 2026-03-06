import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
