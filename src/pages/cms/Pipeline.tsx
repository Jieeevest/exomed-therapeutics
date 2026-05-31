import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { PipelineItem } from '@/types'

const DUMMY: PipelineItem[] = [
  { id: '1', product_name: 'EXOMED-CORD-NEURO', platform: 'Neurological Platform',  stage: 'pre-clinical',   order: 1 },
  { id: '2', product_name: 'EXOMED-AMNI-100M',  platform: 'Orthopedic Platform',    stage: 'research',       order: 2 },
  { id: '3', product_name: 'EXOMED-CORD-300M',  platform: 'Dermatology Platform',   stage: 'special-order',  order: 3 },
  { id: '4', product_name: 'EXOMED-AMNI-300M',  platform: 'Aesthetic Platform',     stage: 'early-research', order: 4 },
]

const STAGES: { value: PipelineItem['stage']; label: string; color: string }[] = [
  { value: 'pre-clinical',   label: 'Pre-Clinical',   color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'research',       label: 'Research',        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'special-order',  label: 'Special Order',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'early-research', label: 'Early Research',  color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
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
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-black rounded-xl hover:opacity-90 transition-opacity">
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
              <div key={stage.value} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4">
                <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border', stage.color)}>
                  {stage.label}
                </span>
                <div className="mt-3 space-y-2">
                  {stageItems.sort((a, b) => a.order - b.order).map(item => (
                    <div key={item.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-xs">
                      <div className="font-black text-white mb-0.5">{item.product_name}</div>
                      <div className="text-slate-500">{item.platform}</div>
                    </div>
                  ))}
                  {stageItems.length === 0 && (
                    <div className="text-xs text-slate-600 py-3 text-center">Belum ada item</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5 text-sm font-black text-slate-400">Semua Item Pipeline</div>
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                {['Urutan', 'Produk', 'Platform', 'Tahap', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.sort((a, b) => a.order - b.order).map(item => {
                const stage = STAGE_MAP[item.stage]
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-black text-slate-400">{item.order}</td>
                    <td className="px-5 py-3.5 font-black font-mono text-sm">{item.product_name}</td>
                    <td className="px-5 py-3.5 text-slate-400">{item.platform}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border', stage.color)}>
                        {stage.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Item Pipeline' : 'Edit Item Pipeline'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nama Produk" value={form.product_name} onChange={v => setForm(p => ({ ...p, product_name: v }))} />
              <Field label="Platform / Indikasi" value={form.platform} onChange={v => setForm(p => ({ ...p, platform: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Tahap</label>
                  <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as PipelineItem['stage'] }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-white">
                    {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Urutan Tampil</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-white" />
                </div>
              </div>
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-white" />
    </div>
  )
}
