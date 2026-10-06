import { NavLink, Outlet } from 'react-router-dom'
import { Bell, ReceiptText, Search, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              BillBuddy
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              Utility Bill Insights
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <NavLink to="/bills" className="mr-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">Bills</NavLink>
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <span className="hidden text-sm text-slate-500 sm:inline">{user?.fullName}</span>
            <button type="button" onClick={logout} className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100" aria-label="Log out">
              <UserRound className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
          <ReceiptText className="h-4 w-4" />
          AI-ready dashboard baseline
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
