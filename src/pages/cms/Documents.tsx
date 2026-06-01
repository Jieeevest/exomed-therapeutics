import { useState } from 'react'
import { Plus, Trash2, X, ExternalLink, FileText, Lock, Globe } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { CmsDocument } from '@/types'

const DUMMY: CmsDocument[] = [
  { id: '1', name: 'Certificate of Analysis — ExoTher 3', category: 'coa', access: 'gated', file_url: '#', uploaded_at: '2026-05-15T00:00:00Z' },
  { id: '2', name: 'Certificate of Analysis — ExoLite',   category: 'coa', access: 'gated', file_url: '#', uploaded_at: '2026-05-15T00:00:00Z' },
  { id: '3', name: 'Legal Entity Document — Exomed US LLC',        category: 'legal',    access: 'publik', file_url: '#', uploaded_at: '2026-04-01T00:00:00Z' },
  { id: '4', name: 'Brosur Produk Exomed Indonesia 2026',          category: 'brosur',   access: 'publik', file_url: '#', uploaded_at: '2026-03-10T00:00:00Z' },
  { id: '5', name: 'Protokol Klinis — Ortopedi',                   category: 'protokol', access: 'gated',  file_url: '#', uploaded_at: '2026-02-20T00:00:00Z' },
]

const CATEGORY_LABEL: Record<string, string> = {
  coa: 'COA', legal: 'Legal', brosur: 'Brosur', protokol: 'Protokol',
}

const CATEGORY_COLOR: Record<string, string> = {
  coa:      'bg-primary/10 text-primary border-primary/20',
  legal:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  brosur:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  protokol: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

type CategoryFilter = 'semua' | CmsDocument['category']

const EMPTY_FORM: Omit<CmsDocument, 'id' | 'uploaded_at'> = {
  name: '', category: 'coa', access: 'gated', file_url: '',
}

export default function Documents() {
  useSessionGuard()

  const [items, setItems] = useState<CmsDocument[]>(DUMMY)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('semua')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Omit<CmsDocument, 'id' | 'uploaded_at'>>(EMPTY_FORM)

  const visible = categoryFilter === 'semua' ? items : items.filter(i => i.category === categoryFilter)

  const handleSave = () => {
    if (!form.name || !form.file_url) return
    setItems(prev => [...prev, { id: String(Date.now()), uploaded_at: new Date().toISOString(), ...form }])
    setModal(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus dokumen ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <CmsLayout
      title="Dokumen & COA"
      subtitle="Kelola file PDF yang dapat diunduh dari halaman publik"
      action={
        <button
          onClick={() => { setForm(EMPTY_FORM); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Upload Dokumen
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-1 p-1 bg-muted/30 border border-border rounded-xl w-fit">
          {(['semua', 'coa', 'legal', 'brosur', 'protokol'] as CategoryFilter[]).map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                categoryFilter === c ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {c === 'semua' ? 'Semua' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                {['Dokumen', 'Kategori', 'Akses', 'Tanggal Upload', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map(item => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-bold text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black uppercase border', CATEGORY_COLOR[item.category])}>
                      {CATEGORY_LABEL[item.category]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {item.access === 'gated'
                        ? <><Lock className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400">Gated</span></>
                        : <><Globe className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Publik</span></>
                      }
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {new Date(item.uploaded_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">Belum ada dokumen.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">Upload Dokumen</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nama Dokumen" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Kategori</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as CmsDocument['category'] }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground">
                    <option value="coa">COA</option>
                    <option value="legal">Legal</option>
                    <option value="brosur">Brosur</option>
                    <option value="protokol">Protokol</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Akses</label>
                  <select value={form.access} onChange={e => setForm(p => ({ ...p, access: e.target.value as CmsDocument['access'] }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground">
                    <option value="gated">Gated (isi form dulu)</option>
                    <option value="publik">Publik (langsung download)</option>
                  </select>
                </div>
              </div>
              <Field label="URL File PDF" value={form.file_url} onChange={v => setForm(p => ({ ...p, file_url: v }))} />
              <p className="text-xs text-muted-foreground">Upload file ke storage terlebih dahulu, lalu paste URL-nya di sini.</p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(false)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors">Batal</button>
                <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity">Simpan</button>
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
