import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import { useGreeting } from '../hooks/useGreeting'
import { formatCurrency } from '../utils/formatCurrency'
import { analyticsApi } from '../services/api'
import { useEffect, useState } from 'react'

function DashboardPage() {
  const greeting = useGreeting()
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    analyticsApi.summary().then(({ data }) => setSummary(data)).catch(() => setError('Analytics are temporarily unavailable.'))
  }, [])
  const monthlySpending = summary?.monthlySpending || []

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm text-slate-200">{greeting}, welcome back.</p>
        <h2 className="mt-2 text-3xl font-semibold">Track, compare, and explain your utility bills.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          BillBuddy helps you centralize bills, compare spending, and review evidence-based changes across your utilities.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Spend" value={formatCurrency(summary?.totalSpending || 0)} delta="Selected records" />
        <StatCard label="Paid Bills" value={summary?.paidCount || 0} delta={formatCurrency(summary?.paidAmount || 0)} />
        <StatCard label="Open Bills" value={(summary?.unpaidCount || 0) + (summary?.overdueCount || 0)} delta={`${summary?.overdueCount || 0} overdue`} />
        <StatCard label="Upcoming Due" value={summary?.upcomingDueDates?.length || 0} delta="Needs attention" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Monthly spend trend</h3>
          <p className="text-sm text-slate-500">Calculated from your saved bills.</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Amount']}
                labelClassName="text-slate-700"
              />
              <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}

export default DashboardPage
