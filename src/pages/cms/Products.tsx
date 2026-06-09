import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Search, Save } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { Select } from '@/components/Select'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const STATUS_COLOR: Record<string, string> = {
  aktif:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  special_order:'bg-amber-500/10 text-amber-400 border-amber-500/20',
  nonaktif:     'bg-slate-500/10 text-muted-foreground border-slate-500/20',
}

const STATUS_LABEL: Record<string, string> = {
  aktif: 'Aktif',
  special_order: 'Special Order',
  nonaktif: 'Nonaktif',
}

type SeriesFilter = 'semua' | 'amniotic' | 'placental'

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '', series: 'amniotic', nanoparticles: '', type: '', description: '', status: 'aktif',
}

export default function Products() {
  useSessionGuard()

  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(5)
  const [tab, setTab] = useState<SeriesFilter>('semua')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [tab, statusFilter, search, limit])
  useEffect(() => { fetchItems() }, [page, tab, statusFilter, search, limit])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (tab !== 'semua') params.set('series', tab)
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetchWithAuth(`/api/cms/products?${params}`)
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModal('create')
  }

  const openEdit = (item: Product) => {
    const { id, ...rest } = item
    setEditId(id)
    setForm(rest)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name || !form.nanoparticles || !form.type) return
    if (modal === 'edit' && editId) {
      const res = await fetchWithAuth(`/api/cms/products/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      const res = await fetchWithAuth('/api/cms/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setItems(prev => [data.data, ...prev])
    }
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    const res = await fetchWithAuth(`/api/cms/products/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <CmsLayout
      title="Produk"
      subtitle="Kelola varian produk exosome"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 p-1 bg-muted/30 border border-border rounded-xl">
            {(['semua', 'amniotic', 'placental'] as SeriesFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                  tab === t ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'amniotic' ? 'Amniotic Series' : t === 'placental' ? 'Placental Cord Series' : 'Semua'}
              </button>
            ))}
          </div>
          <Select
            value={statusFilter ? { value: statusFilter, label: statusFilter === 'aktif' ? 'Aktif' : statusFilter === 'special_order' ? 'Special Order' : 'Nonaktif' } : null}
            onChange={opt => setStatusFilter(opt?.value ?? '')}
            options={[
              { value: 'aktif', label: 'Aktif' },
              { value: 'special_order', label: 'Special Order' },
              { value: 'nonaktif', label: 'Nonaktif' },
            ]}
            placeholder="Semua Status"
            isClearable
            isSearchable={false}
            wrapperClassName="w-44"
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama produk..."
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-black uppercase border', STATUS_COLOR[item.status])}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
                  {item.series === 'amniotic' ? 'Amniotic Series' : 'Placental Cord Series'}
                </div>
                <h3 className="font-black text-base mb-0.5">{item.name}</h3>
                <div className="text-xs font-bold text-primary mb-0.5">{item.nanoparticles} Nanopartikel</div>
                <div className="text-[11px] text-muted-foreground font-semibold mb-3">{item.type}</div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{item.description}</p>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-3 py-12 text-center text-muted-foreground text-sm">Belum ada data.</div>
            )}
          </div>
        )}
        <Pagination page={page} total={total} limit={limit} onChange={setPage} />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <FormField label="Nama Produk" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Series"
                  value={{ value: form.series, label: form.series === 'amniotic' ? 'Amniotic Series' : 'Placental Cord Series' }}
                  onChange={opt => setForm(p => ({ ...p, series: opt!.value as Product['series'] }))}
                  options={[
                    { value: 'amniotic', label: 'Amniotic Series' },
                    { value: 'placental', label: 'Placental Cord Series' },
                  ]}
                  isSearchable={false}
                />
                <Select
                  label="Status"
                  value={{ value: form.status, label: form.status === 'aktif' ? 'Aktif' : form.status === 'special_order' ? 'Special Order' : 'Nonaktif' }}
                  onChange={opt => setForm(p => ({ ...p, status: opt!.value as Product['status'] }))}
                  options={[
                    { value: 'aktif', label: 'Aktif' },
                    { value: 'special_order', label: 'Special Order' },
                    { value: 'nonaktif', label: 'Nonaktif' },
                  ]}
                  isSearchable={false}
                />
              </div>
              <FormField label="Jumlah Nanopartikel (mis. 100 Juta)" value={form.nanoparticles} onChange={v => setForm(p => ({ ...p, nanoparticles: v }))} />
              <FormField label="Tipe (mis. MSC Amniotic Derived)" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Deskripsi Singkat</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground placeholder:text-muted-foreground/30" />
              </div>
              <FormField label="URL Gambar Vial (opsional)" value={form.image_url ?? ''} onChange={v => setForm(p => ({ ...p, image_url: v }))} />
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

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30" />
    </div>
  )
}
