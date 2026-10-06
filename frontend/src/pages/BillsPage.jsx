import { useEffect, useState } from 'react'
import { billsApi } from '../services/api'

const emptyForm = { utilityType: 'ELECTRICITY', providerName: '', billingPeriod: '', totalAmount: '', usageAmount: '', usageUnit: '', dueDate: '', status: 'UNPAID', lineItems: [] }

function BillsPage() {
  const [pageData, setPageData] = useState({ content: [], page: 0, totalPages: 0 })
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({})

  const load = async () => {
    try {
      const { data } = await billsApi.list({ ...filters, page: pageData.page || 0, size: 10, sort: 'billingPeriod,desc' })
      setPageData(data)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load bills.')
    }
  }
  useEffect(() => { load() }, [filters])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    const payload = { ...form, totalAmount: Number(form.totalAmount), usageAmount: form.usageAmount ? Number(form.usageAmount) : null, dueDate: form.dueDate || null }
    try {
      if (editingId) await billsApi.update(editingId, payload)
      else await billsApi.create(payload)
      setForm(emptyForm); setEditingId(null); await load()
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to save bill.')
    } finally { setBusy(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this bill?')) return
    await billsApi.remove(id); await load()
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-semibold text-slate-900">Your bills</h2><p className="text-sm text-slate-500">Manage your utility records.</p></div><select aria-label="Filter utility" value={filters.utilityType || ''} onChange={(e) => setFilters({ ...filters, utilityType: e.target.value || undefined })} className="rounded-lg border border-slate-300 p-2"><option value="">All utilities</option><option>ELECTRICITY</option><option>WATER</option><option>INTERNET</option></select></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {pageData.content.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No bills yet. Add your first bill.</div> : pageData.content.map((bill) => <article key={bill.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{bill.providerName}</h3><p className="text-sm text-slate-500">{bill.utilityType} · {bill.billingPeriod}</p></div><strong className="text-lg text-slate-900">₹{Number(bill.totalAmount).toFixed(2)}</strong></div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{bill.status}</span><button onClick={() => { setEditingId(bill.id); setForm({ ...bill, totalAmount: bill.totalAmount, usageAmount: bill.usageAmount || '', lineItems: bill.lineItems || [] }) }} className="ml-auto text-sm text-indigo-600">Edit</button><button onClick={() => remove(bill.id)} className="text-sm text-red-600">Delete</button></div></article>)}
      </div>
      <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-semibold">{editingId ? 'Edit bill' : 'Add bill'}</h3><label className="block text-sm">Utility<select required value={form.utilityType} onChange={(e) => setForm({ ...form, utilityType: e.target.value })} className="mt-1 w-full rounded-lg border p-2"><option>ELECTRICITY</option><option>WATER</option><option>INTERNET</option></select></label><label className="block text-sm">Provider<input required maxLength={100} value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Billing period<input required type="date" value={form.billingPeriod} onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Total amount<input required min="0" step="0.01" type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Due date<input type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label><button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : editingId ? 'Update bill' : 'Add bill'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }} className="w-full text-sm text-slate-500">Cancel edit</button>}</form>
    </section>
  )
}

export default BillsPage
