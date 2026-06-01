import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { PipelineItem } from '@/types'

const DUMMY: PipelineItem[] = [
  { id: '1', product_name: 'ExoMatrix', platform: 'Neurological Platform',  stage: 'pre-clinical',   order: 1 },
  { id: '2', product_name: 'ExoTher 3', platform: 'Orthopedic Platform',    stage: 'research',       order: 2 },
  { id: '3', product_name: 'ExoGen',    platform: 'Dermatology Platform',   stage: 'special-order',  order: 3 },
  { id: '4', product_name: 'ExoPro',    platform: 'Aesthetic Platform',     stage: 'early-research', order: 4 },
]

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

  const [items, setItems] = useState<PipelineItem[]>(DUMMY)
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<PipelineItem, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

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

  const handleSave = () => {
    if (!form.product_name || !form.platform) return
    if (modal === 'edit' && editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { id: String(Date.now()), ...form }])
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus item pipeline ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
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
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STAGES.map(stage => {
            const stageItems = items.filter(i => i.stage === stage.value)
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
          <div className="px-5 py-3.5 border-b border-border text-sm font-black text-muted-foreground">Semua Item Pipeline</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                {['Urutan', 'Produk', 'Platform', 'Tahap', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.sort((a, b) => a.order - b.order).map(item => {
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
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Item Pipeline' : 'Edit Item Pipeline'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nama Produk" value={form.product_name} onChange={v => setForm(p => ({ ...p, product_name: v }))} />
              <Field label="Platform / Indikasi" value={form.platform} onChange={v => setForm(p => ({ ...p, platform: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Tahap</label>
                  <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as PipelineItem['stage'] }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground">
                    {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Urutan Tampil</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors">Batal</button>
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
