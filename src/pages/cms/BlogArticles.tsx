import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { BlogArticle } from '@/types'

const DUMMY: BlogArticle[] = [
  { id: '1', title: 'Memahami Mekanisme Parakrin Exosome pada Regenerasi Jaringan', category: 'edukasi-exosome', content: 'Exosome bekerja melalui mekanisme parakrin...', author: 'Tim Medis Exomed', published_at: '2026-05-20T00:00:00Z', status: 'publish', slug: 'mekanisme-parakrin-exosome' },
  { id: '2', title: 'Perbedaan Exosome vs Stem Cell: Panduan untuk Klinisi', category: 'edukasi-exosome', content: 'Banyak dokter yang masih...', author: 'Tim Medis Exomed', published_at: '2026-05-10T00:00:00Z', status: 'publish', slug: 'exosome-vs-stem-cell' },
  { id: '3', title: 'Update: Protokol Terbaru untuk Aplikasi Ortopedi', category: 'riset', content: 'Berdasarkan data observasional terbaru...', author: 'dr. Ahmad, SpOT', published_at: '2026-04-25T00:00:00Z', status: 'publish', slug: 'protokol-terbaru-ortopedi' },
  { id: '4', title: 'Exomed Indonesia Hadir di Kongres PERDOSSI 2026', category: 'update-perusahaan', content: 'Draft...', author: 'Tim Exomed', published_at: '2026-05-28T00:00:00Z', status: 'draft', slug: 'exomed-perdossi-2026' },
]

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

  const [items, setItems] = useState<BlogArticle[]>(DUMMY)
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<BlogArticle, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

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

  const handleSave = () => {
    if (!form.title || !form.content || !form.author) return
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (modal === 'edit' && editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form, slug } : i))
    } else {
      setItems(prev => [...prev, { id: String(Date.now()), ...form, slug }])
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'publish' ? 'draft' : 'publish' } : i))
  }

  return (
    <CmsLayout
      title="Artikel"
      subtitle="Kelola konten edukasi dan update perusahaan"
      action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Tulis Artikel
        </button>
      }
    >
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              {['Judul', 'Kategori', 'Author', 'Tanggal', 'Status', 'Aksi'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 max-w-xs">
                  <div className="font-bold text-sm truncate">{item.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">/{item.slug}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border whitespace-nowrap', CATEGORY_COLOR[item.category])}>
                    {CATEGORY_LABEL[item.category]}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-slate-400">{item.author}</td>
                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border transition-all',
                      item.status === 'publish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                    )}
                  >
                    {item.status === 'publish' ? 'Publish' : 'Draft'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">Belum ada artikel.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tulis Artikel' : 'Edit Artikel'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <Field label="Judul Artikel" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Kategori</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as BlogArticle['category'] }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-white">
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
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Konten Artikel</label>
                <textarea rows={12} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-y font-mono text-white placeholder:text-white/20" placeholder="Tulis konten artikel di sini..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.status === 'publish'} onChange={e => setForm(p => ({ ...p, status: e.target.checked ? 'publish' : 'draft' }))} className="rounded" />
                Publish langsung
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm font-bold hover:bg-white/[0.09] transition-colors">Batal</button>
                <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-black hover:opacity-90 transition-opacity">Simpan</button>
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
      <label className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-white placeholder:text-white/20" />
    </div>
  )
}
