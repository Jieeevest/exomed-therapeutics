import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Download } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'sonner'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'
import { cn } from '@/lib/utils'
import type { Inquiry } from '@/types'

const STATUS_OPTS = ['semua', 'baru', 'diproses', 'selesai'] as const
type StatusFilter = typeof STATUS_OPTS[number]

const STATUS_COLOR: Record<string, string> = {
  baru:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  diproses: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  selesai:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default function Inquiries() {
  useSessionGuard()

  const [filter, setFilter] = useState<StatusFilter>('semua')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(5)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { setPage(1) }, [search, filter, limit, sortBy, sortDir])
  useEffect(() => { fetchItems() }, [page, search, filter, limit, sortBy, sortDir])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir })
      if (search) params.set('search', search)
      if (filter !== 'semua') params.set('status', filter)
      const res = await fetchWithAuth(`/api/cms/inquiries?${params}`)
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    const res = await fetchWithAuth(`/api/cms/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success('Status berhasil diperbarui')
    }
  }

  const saveNotes = async (id: string) => {
    const res = await fetchWithAuth(`/api/cms/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: selected?.status, notes }),
    })
    const data = await res.json()
    if (data.success) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, notes } : null)
      toast.success('Catatan berhasil disimpan')
    }
  }

  const openDetail = (item: Inquiry) => {
    setSelected(item)
    setNotes(item.notes ?? '')
  }

  return (
    <CmsLayout
      title="Inquiry & Konsultasi"
      subtitle="Semua submission dari form konsultasi halaman publik"
      action={
        <button className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border text-sm font-bold rounded-xl hover:bg-muted/40 transition-colors">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 p-1 bg-muted/30 border border-border rounded-xl">
            {STATUS_OPTS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                  filter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau klinik..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{total} inquiry ditemukan</span>
            <LimitSelector value={limit} onChange={v => { setLimit(v); setPage(1) }} />
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
            ) : (
              <table className="w-full text-sm whitespace-nowrap">
                <thead className="bg-muted/20 text-muted-foreground border-b border-border">
                  <tr>
                    <SortableHeader label="Nama & Profesi" field="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Klinik / Kota" field="city" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Produk</th>
                    <SortableHeader label="Tanggal" field="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Status" field="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => openDetail(item)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.specialty}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-foreground">{item.clinic}</div>
                        <div className="text-xs text-muted-foreground">{item.city}</div>
                      </td>
                      <td className="px-5 py-3.5 text-foreground font-mono text-xs">{item.product_interest}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black uppercase border', STATUS_COLOR[item.status])}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">Tidak ada inquiry ditemukan.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
          >
          <motion.div
            className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="font-black text-lg">{selected.name}</h2>
                <div className="text-xs text-muted-foreground mt-0.5">{selected.specialty} &bull; {selected.clinic}, {selected.city}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground mb-0.5">WhatsApp</div><a href={`https://wa.me/${selected.whatsapp}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{selected.whatsapp}</a></div>
                <div><div className="text-xs text-muted-foreground mb-0.5">Produk Diminati</div><span className="font-mono text-xs">{selected.product_interest}</span></div>
              </div>

              {selected.message && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Pesan</div>
                  <p className="text-sm text-foreground bg-muted/20 border border-border rounded-xl p-3">{selected.message}</p>
                </div>
              )}

              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Ubah Status</div>
                <div className="flex gap-2">
                  {(['baru', 'diproses', 'selesai'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-black uppercase border transition-all',
                        selected.status === s ? STATUS_COLOR[s] : 'text-muted-foreground border-border hover:border-white/20',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Catatan Internal</div>
                <textarea
                  rows={3}
                  autoComplete="off"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tambah catatan untuk tim..."
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground placeholder:text-muted-foreground/30"
                />
                <button
                  onClick={() => saveNotes(selected.id)}
                  className="mt-2 px-4 py-1.5 bg-primary text-white text-xs font-black rounded-lg hover:opacity-90 transition-opacity"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CmsLayout>
  )
}
