import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Search, Save } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { Select } from '@/components/Select'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'
import { cn } from '@/lib/utils'
import type { ApplicationArea } from '@/types'

const EMPTY_FORM: Omit<ApplicationArea, 'id'> = {
  name: '', specialty: '', description: '', icon: '', order: 0, is_active: true,
}

export default function ApplicationAreas() {
  useSessionGuard()

  const [items, setItems] = useState<ApplicationArea[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(50)
  const [sortBy, setSortBy] = useState('order')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [activeFilter, setActiveFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<ApplicationArea, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [limit, sortBy, sortDir, activeFilter, search])
  useEffect(() => { fetchItems() }, [page, limit, sortBy, sortDir, activeFilter, search])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir })
      if (activeFilter) params.set('is_active', activeFilter)
      if (search) params.set('search', search)
      const res = await fetchWithAuth(`/api/cms/application-areas?${params}`)
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, order: items.length + 1 })
    setEditId(null)
    setModal('create')
  }

  const openEdit = (item: ApplicationArea) => {
    const { id, ...rest } = item
    setEditId(id)
    setForm(rest)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name) return
    if (modal === 'edit' && editId) {
      const res = await fetchWithAuth(`/api/cms/application-areas/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      const res = await fetchWithAuth('/api/cms/application-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setItems(prev => [...prev, data.data])
    }
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus area ini?')) return
    const res = await fetchWithAuth(`/api/cms/application-areas/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) setItems(prev => prev.filter(i => i.id !== id))
  }

  const toggleActive = async (item: ApplicationArea) => {
    const is_active = !item.is_active
    const res = await fetchWithAuth(`/api/cms/application-areas/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active }),
    })
    const data = await res.json()
    if (data.success) setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active } : i))
  }

  return (
    <CmsLayout
      title="Area Aplikasi"
      subtitle="Kelola area terapeutik yang ditampilkan di halaman publik"
      action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Tambah Area
        </button>
      }
    >
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
            <Select
              value={activeFilter ? { value: activeFilter, label: activeFilter === 'true' ? 'Aktif' : 'Nonaktif' } : null}
              onChange={opt => setActiveFilter(opt?.value ?? '')}
              options={[{ value: 'true', label: 'Aktif' }, { value: 'false', label: 'Nonaktif' }]}
              placeholder="Semua Status"
              isClearable
              isSearchable={false}
              wrapperClassName="w-40"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama area..."
                className="pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="ml-auto">
              <LimitSelector value={limit} onChange={v => { setLimit(v); setPage(1) }} />
            </div>
          </div>
          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-border">
                <tr>
                  <SortableHeader label="Urutan" field="order" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Nama Area" field="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Spesialisasi" field="specialty" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Deskripsi</th>
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(item => (
                  <tr key={item.id} className={cn('transition-colors', item.is_active ? 'hover:bg-muted/20' : 'opacity-50 hover:bg-muted/20')}>
                    <td className="px-5 py-3.5 font-black text-muted-foreground">{item.order}</td>
                    <td className="px-5 py-3.5 font-bold">{item.name}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground font-semibold">{item.specialty}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-xs truncate">{item.description}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(item)} className="flex items-center gap-1.5 text-xs font-bold transition-colors">
                        {item.is_active
                          ? <><ToggleRight className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Aktif</span></>
                          : <><ToggleLeft className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Nonaktif</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">Belum ada data.</td></tr>
                )}
              </tbody>
            </table>
          )}
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Area' : 'Edit Area'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nama Area" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Spesialisasi" value={form.specialty} onChange={v => setForm(p => ({ ...p, specialty: v }))} />
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Urutan Tampil</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground" />
                </div>
              </div>
              <Field label="Nama Ikon (Lucide)" value={form.icon} onChange={v => setForm(p => ({ ...p, icon: v }))} />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground placeholder:text-muted-foreground/30" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded" />
                Tampilkan di halaman publik
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors">Batal</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity"><Save className="w-4 h-4" />Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CmsLayout>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground" />
    </div>
  )
}
