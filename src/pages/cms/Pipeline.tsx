import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Search, Save } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { Select } from '@/components/Select'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'sonner'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'
import { cn } from '@/lib/utils'
import type { PipelineItem } from '@/types'

const STAGES: { value: PipelineItem['stage']; label: string; color: string }[] = [
  { value: 'pre-clinical',   label: 'Pre-Clinical',   color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'research',       label: 'Research',        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'special-order',  label: 'Special Order',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'early-research', label: 'Early Research',  color: 'bg-slate-500/10 text-muted-foreground border-slate-500/20' },
]

const STAGE_MAP = Object.fromEntries(STAGES.map(s => [s.value, s]))

const EMPTY_FORM: Omit<PipelineItem, 'id'> = {
  product_name: '', platform: '', stage: 'research', order: 0,
}

export default function Pipeline() {
  useSessionGuard()

  const [items, setItems] = useState<PipelineItem[]>([])
  const [allItems, setAllItems] = useState<PipelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(5)
  const [sortBy, setSortBy] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [stageFilter, setStageFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<PipelineItem, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [limit, sortBy, sortDir, stageFilter, search])
  useEffect(() => { fetchItems() }, [page, limit, sortBy, sortDir, stageFilter, search])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_dir: sortDir })
      if (sortBy) params.set('sort_by', sortBy)
      if (stageFilter) params.set('stage', stageFilter)
      if (search) params.set('search', search)
      const res = await fetchWithAuth(`/api/cms/pipeline?${params}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.data)
        setTotal(data.total ?? data.data.length)
        if (page === 1 && !stageFilter && !search) setAllItems(data.data)
      }
    } catch {}
    finally { setLoading(false) }
  }

  const fetchAllForCards = async () => {
    try {
      const res = await fetchWithAuth('/api/cms/pipeline?limit=500')
      const data = await res.json()
      if (data.success) setAllItems(data.data)
    } catch {}
  }

  useEffect(() => { fetchAllForCards() }, [])

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, order: items.length + 1 })
    setEditId(null)
    setModal('create')
  }

  const openEdit = (item: PipelineItem) => {
    const { id, ...rest } = item
    setEditId(id)
    setForm(rest)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.product_name || !form.platform) return
    if (modal === 'edit' && editId) {
      const res = await fetchWithAuth(`/api/cms/pipeline/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
        setAllItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
        toast.success('Pipeline berhasil diperbarui')
      }
    } else {
      const res = await fetchWithAuth('/api/cms/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => [...prev, data.data])
        setAllItems(prev => [...prev, data.data])
        toast.success('Pipeline berhasil ditambahkan')
      }
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    toast.warning('Hapus item pipeline ini?', {
      action: { label: 'Hapus', onClick: async () => {
        const res = await fetchWithAuth(`/api/cms/pipeline/${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          setItems(prev => prev.filter(i => i.id !== id))
          setAllItems(prev => prev.filter(i => i.id !== id))
          toast.success('Item pipeline berhasil dihapus')
        }
      }},
      cancel: { label: 'Batal' },
    })
  }

  return (
    <CmsLayout
      title="Pipeline Penelitian"
      subtitle="Kelola tabel tahap pengembangan produk"
      action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Tambah Item
        </button>
      }
    >
      {loading && items.length === 0 ? (
        <div className="py-16 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STAGES.map(stage => {
              const stageItems = allItems.filter(i => i.stage === stage.value)
              return (
                <div key={stage.value} className="bg-card border border-border rounded-2xl p-4">
                  <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black uppercase border', stage.color)}>
                    {stage.label}
                  </span>
                  <div className="mt-3 space-y-2">
                    {stageItems.sort((a, b) => a.order - b.order).map(item => (
                      <div key={item.id} className="bg-muted/30 border border-border rounded-xl p-3 text-xs">
                        <div className="font-black text-foreground mb-0.5">{item.product_name}</div>
                        <div className="text-muted-foreground">{item.platform}</div>
                      </div>
                    ))}
                    {stageItems.length === 0 && (
                      <div className="text-xs text-muted-foreground py-3 text-center">Belum ada item</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
              <span className="text-sm font-black text-muted-foreground">Semua Item Pipeline</span>
              <Select
                value={stageFilter ? STAGES.find(s => s.value === stageFilter) ?? null : null}
                onChange={opt => setStageFilter(opt?.value ?? '')}
                options={STAGES}
                placeholder="Semua Tahap"
                isClearable
                isSearchable={false}
                compact
                wrapperClassName="w-44"
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="ml-auto">
                <LimitSelector value={limit} onChange={v => { setLimit(v); setPage(1) }} />
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-border">
                <tr>
                  <SortableHeader label="Urutan" field="order" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Produk" field="product_name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Platform</th>
                  <SortableHeader label="Tahap" field="stage" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(item => {
                  const stage = STAGE_MAP[item.stage]
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-black text-muted-foreground">{item.order}</td>
                      <td className="px-5 py-3.5 font-black font-mono text-sm">{item.product_name}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.platform}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black uppercase border', stage.color)}>
                          {stage.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">Belum ada data.</td></tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Item Pipeline' : 'Edit Item Pipeline'}</h2>
                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nama Produk" required placeholder="cth. EXO-BONE" value={form.product_name} onChange={v => setForm(p => ({ ...p, product_name: v }))} />
                  <Field label="Platform / Indikasi" required placeholder="cth. Degenerasi Sendi / OA" value={form.platform} onChange={v => setForm(p => ({ ...p, platform: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Tahap"
                    value={STAGES.find(s => s.value === form.stage) ?? null}
                    onChange={opt => setForm(p => ({ ...p, stage: opt!.value as PipelineItem['stage'] }))}
                    options={STAGES}
                    isSearchable={false}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Urutan Tampil</label>
                    <input type="number" autoComplete="off" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors">Batal</button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity"><Save className="w-4 h-4" />Simpan</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CmsLayout>
  )
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input autoComplete="off" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30" />
    </div>
  )
}
