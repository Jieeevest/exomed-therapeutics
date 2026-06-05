import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Search, Save } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'
import { cn } from '@/lib/utils'
import type { BlogArticle } from '@/types'

const CATEGORY_LABEL: Record<string, string> = {
  'edukasi-exosome': 'Edukasi Exosome',
  'riset': 'Riset',
  'update-perusahaan': 'Update Perusahaan',
}

const CATEGORY_COLOR: Record<string, string> = {
  'edukasi-exosome':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'riset':              'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'update-perusahaan': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const EMPTY_FORM: Omit<BlogArticle, 'id'> = {
  title: '', category: 'edukasi-exosome', content: '', author: '', published_at: new Date().toISOString(), status: 'draft', slug: '',
}

export default function BlogArticles() {
  useSessionGuard()

  const [items, setItems] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(5)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<BlogArticle, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [limit, sortBy, sortDir, statusFilter, categoryFilter, search])
  useEffect(() => { fetchItems() }, [page, limit, sortBy, sortDir, statusFilter, categoryFilter, search])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir })
      if (statusFilter) params.set('status', statusFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      if (search) params.set('search', search)
      const res = await fetchWithAuth(`/api/cms/articles?${params}`)
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, published_at: new Date().toISOString() })
    setEditId(null)
    setModal('create')
  }

  const openEdit = (item: BlogArticle) => {
    const { id, ...rest } = item
    setEditId(id)
    setForm(rest)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.title || !form.content || !form.author) return
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const body = { ...form, slug }
    if (modal === 'edit' && editId) {
      const res = await fetchWithAuth(`/api/cms/articles/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) setItems(prev => prev.map(i => i.id === editId ? { ...i, ...body } : i))
    } else {
      const res = await fetchWithAuth('/api/cms/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) setItems(prev => [data.data, ...prev])
    }
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    const res = await fetchWithAuth(`/api/cms/articles/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) setItems(prev => prev.filter(i => i.id !== id))
  }

  const toggleStatus = async (item: BlogArticle) => {
    const newStatus = item.status === 'publish' ? 'draft' : 'publish'
    const res = await fetchWithAuth(`/api/cms/articles/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await res.json()
    if (data.success) setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
  }

  return (
    <CmsLayout
      title="Artikel"
      subtitle="Kelola konten edukasi dan update perusahaan"
      action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Tulis Artikel
        </button>
      }
    >
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary/40 transition-colors"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary/40 transition-colors"
            >
              <option value="">Semua Kategori</option>
              <option value="edukasi-exosome">Edukasi Exosome</option>
              <option value="riset">Riset</option>
              <option value="update-perusahaan">Update Perusahaan</option>
            </select>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul..."
                className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/50"
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
                  <SortableHeader label="Judul" field="title" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Kategori" field="category" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Author</th>
                  <SortableHeader label="Tanggal" field="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Status" field="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-bold text-sm truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">/{item.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black uppercase border whitespace-nowrap', CATEGORY_COLOR[item.category])}>
                        {CATEGORY_LABEL[item.category]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{item.author}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(item)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-black uppercase border transition-all',
                          item.status === 'publish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-muted-foreground border-slate-500/20',
                        )}
                      >
                        {item.status === 'publish' ? 'Publish' : 'Draft'}
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
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tulis Artikel' : 'Edit Artikel'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <Field label="Judul Artikel" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Kategori</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as BlogArticle['category'] }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground">
                    <option value="edukasi-exosome">Edukasi Exosome</option>
                    <option value="riset">Riset</option>
                    <option value="update-perusahaan">Update Perusahaan</option>
                  </select>
                </div>
                <Field label="Author" value={form.author} onChange={v => setForm(p => ({ ...p, author: v }))} />
              </div>
              <Field label="Slug URL (opsional — auto-generate jika kosong)" value={form.slug} onChange={v => setForm(p => ({ ...p, slug: v }))} />
              <Field label="URL Thumbnail (opsional)" value={form.thumbnail_url ?? ''} onChange={v => setForm(p => ({ ...p, thumbnail_url: v }))} />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Konten Artikel</label>
                <textarea rows={12} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-y font-mono text-foreground placeholder:text-foreground/20" placeholder="Tulis konten artikel di sini..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.status === 'publish'} onChange={e => setForm(p => ({ ...p, status: e.target.checked ? 'publish' : 'draft' }))} className="rounded" />
                Publish langsung
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

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30" />
    </div>
  )
}
