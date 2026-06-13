import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle, Search, Save } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { FileUpload } from '@/components/cms/FileUpload'
import { Select } from '@/components/Select'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'sonner'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'
import { cn } from '@/lib/utils'
import type { CaseStudy, CaseStudyMetric, CaseStudyImage } from '@/types'

const EMPTY_FORM: Omit<CaseStudy, 'id' | 'created_at'> = {
  specialty: '', title: '', patient_description: '',
  images: [],
  metrics: [{ label: '', value: '' }],
  disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
  is_published: false,
}

export default function CaseStudies() {
  useSessionGuard()

  const [items, setItems] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(5)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [publishedFilter, setPublishedFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<CaseStudy, 'id' | 'created_at'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [limit, sortBy, sortDir, specialtyFilter, publishedFilter, search])
  useEffect(() => { fetchItems() }, [page, limit, sortBy, sortDir, specialtyFilter, publishedFilter, search])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir })
      if (specialtyFilter) params.set('specialty', specialtyFilter)
      if (publishedFilter) params.set('is_published', publishedFilter)
      if (search) params.set('search', search)
      const res = await fetchWithAuth(`/api/cms/case-studies?${params}`)
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, metrics: [{ label: '', value: '' }] })
    setEditId(null)
    setModal('create')
  }

  const openEdit = (item: CaseStudy) => {
    const { id, created_at: _created_at, ...rest } = item
    void _created_at
    setEditId(id)
    setForm({ ...rest, metrics: [...rest.metrics] })
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.title || !form.specialty) return
    if (modal === 'edit' && editId) {
      const res = await fetchWithAuth(`/api/cms/case-studies/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
        toast.success('Studi kasus berhasil diperbarui')
      }
    } else {
      const res = await fetchWithAuth('/api/cms/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => [data.data, ...prev])
        toast.success('Studi kasus berhasil ditambahkan')
      }
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    toast.warning('Hapus studi kasus ini?', {
      action: { label: 'Hapus', onClick: async () => {
        const res = await fetchWithAuth(`/api/cms/case-studies/${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          setItems(prev => prev.filter(i => i.id !== id))
          toast.success('Studi kasus berhasil dihapus')
        }
      }},
      cancel: { label: 'Batal', onClick: () => {} },
    })
  }

  const togglePublish = async (item: CaseStudy) => {
    const is_published = !item.is_published
    const res = await fetchWithAuth(`/api/cms/case-studies/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published }),
    })
    const data = await res.json()
    if (data.success) setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_published } : i))
  }

  const updateMetric = (idx: number, field: keyof CaseStudyMetric, value: string) => {
    setForm(p => {
      const metrics = [...p.metrics]
      metrics[idx] = { ...metrics[idx], [field]: value }
      return { ...p, metrics }
    })
  }

  const addMetric = () => setForm(p => ({ ...p, metrics: [...p.metrics, { label: '', value: '' }] }))
  const removeMetric = (idx: number) => setForm(p => ({ ...p, metrics: p.metrics.filter((_, i) => i !== idx) }))

  const updateImage = (idx: number, field: keyof CaseStudyImage, value: string) => {
    setForm(p => {
      const images = [...(p.images ?? [])]
      images[idx] = { ...images[idx], [field]: value }
      return { ...p, images }
    })
  }
  const addImage = () => setForm(p => ({ ...p, images: [...(p.images ?? []), { src: '', caption: '' }] }))
  const removeImage = (idx: number) => setForm(p => ({ ...p, images: (p.images ?? []).filter((_, i) => i !== idx) }))

  return (
    <CmsLayout
      title="Studi Kasus"
      subtitle="Kelola data observasional klinis"
      action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Tambah Studi Kasus
        </button>
      }
    >
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
            <input
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              placeholder="Filter spesialisasi..."
              className="px-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/50"
            />
            <Select
              value={publishedFilter ? { value: publishedFilter, label: publishedFilter === 'true' ? 'Published' : 'Draft' } : null}
              onChange={opt => setPublishedFilter(opt?.value ?? '')}
              options={[{ value: 'true', label: 'Published' }, { value: 'false', label: 'Draft' }]}
              placeholder="Semua Status"
              isClearable
              isSearchable={false}
              compact
              wrapperClassName="w-40"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul..."
                className="pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/50"
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
                  <SortableHeader label="Spesialisasi" field="specialty" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Judul" field="title" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Metrik</th>
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 text-xs font-black text-primary uppercase tracking-wider">{item.specialty}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm max-w-xs">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{item.patient_description}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{item.metrics.length} metrik &bull; {(item.images ?? []).length} gambar</td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(item)} className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-black uppercase border transition-all',
                        item.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-muted-foreground border-slate-500/20',
                      )}>
                        {item.is_published ? 'Publish' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">Belum ada data.</td></tr>
                )}
              </tbody>
            </table>
          )}
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>

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
            className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Studi Kasus' : 'Edit Studi Kasus'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Spesialisasi" required placeholder="cth. Orthopedi" value={form.specialty} onChange={v => setForm(p => ({ ...p, specialty: v }))} />
                <Field label="Judul Studi Kasus" required placeholder="cth. Regenerasi Sendi Lutut OA Grade III" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Deskripsi Pasien / Metode</label>
                <textarea autoComplete="off" rows={3} value={form.patient_description} onChange={e => setForm(p => ({ ...p, patient_description: e.target.value }))} placeholder="cth. Pasien wanita 58 tahun dengan OA grade III, diberikan injeksi tunggal 100 juta MSC amniotic..." className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground placeholder:text-muted-foreground/30" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Gambar</label>
                  <button onClick={addImage} className="flex items-center gap-1 text-xs text-primary hover:underline"><PlusCircle className="w-3.5 h-3.5" /> Tambah Gambar</button>
                </div>
                <div className="space-y-3">
                  {(form.images ?? []).map((img, idx) => (
                    <div key={idx} className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 space-y-2">
                      <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 transition-colors"><MinusCircle className="w-4 h-4" /></button>
                      <FileUpload
                        value={img.src}
                        onChange={url => updateImage(idx, 'src', url)}
                        accept="image/*"
                        folder="case-studies"
                        hint="JPG, PNG, WebP"
                      />
                      <input autoComplete="off" placeholder="Caption (mis. Pre-treatment)" value={img.caption} onChange={e => updateImage(idx, 'caption', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                    </div>
                  ))}
                  {(form.images ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground/50 italic">Belum ada gambar. Klik "Tambah Gambar" untuk menambahkan foto before/after.</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Metrik</label>
                  <button onClick={addMetric} className="flex items-center gap-1 text-xs text-primary hover:underline"><PlusCircle className="w-3.5 h-3.5" /> Tambah Metrik</button>
                </div>
                <div className="space-y-2">
                  {form.metrics.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input autoComplete="off" placeholder="Label (mis. VAS Score)" value={m.label} onChange={e => updateMetric(idx, 'label', e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      <input autoComplete="off" placeholder="Nilai (mis. −4.1 poin)" value={m.value} onChange={e => updateMetric(idx, 'value', e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      {form.metrics.length > 1 && (
                        <button onClick={() => removeMetric(idx)} className="text-muted-foreground hover:text-red-400 transition-colors"><MinusCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Disclaimer</label>
                <textarea autoComplete="off" rows={2} value={form.disclaimer} onChange={e => setForm(p => ({ ...p, disclaimer: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="rounded" />
                Publish (tampil di halaman publik)
              </label>

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
