import { useState } from 'react'
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { ApplicationArea } from '@/types'

const DUMMY: ApplicationArea[] = [
  { id: '1', name: 'Ortopedi',        specialty: 'SpOT',  description: 'Sendi, tulang rawan, regenerasi jaringan muskuloskeletal.',    icon: 'Bone',     order: 1, is_active: true },
  { id: '2', name: 'Dermatologi',     specialty: 'SpKK',  description: 'Penyembuhan luka, anti-aging, skin rejuvenation.',            icon: 'Sparkles', order: 2, is_active: true },
  { id: '3', name: 'Neurologi',       specialty: 'SpN',   description: 'Neuroproteksi, pemulihan fungsi saraf.',                       icon: 'Brain',    order: 3, is_active: true },
  { id: '4', name: 'Estetika Medis',  specialty: 'FKUI',  description: 'Anti-aging, hidrasi, perbaikan tekstur kulit.',                icon: 'Eye',      order: 4, is_active: true },
  { id: '5', name: 'Restorasi Rambut',specialty: 'SpKK',  description: 'Stimulasi folikel rambut, alopecia androgenetik.',            icon: 'Scissors', order: 5, is_active: true },
  { id: '6', name: 'Sports Medicine', specialty: 'SpKO',  description: 'Pemulihan cedera olahraga, regenerasi ligamen dan tendon.',    icon: 'Activity', order: 6, is_active: true },
  { id: '7', name: 'Andrologi',       specialty: 'SpAnd', description: 'Kesehatan reproduksi pria.',                                  icon: 'Dna',      order: 7, is_active: false },
  { id: '8', name: 'Oftalmologi',     specialty: 'SpM',   description: 'Permukaan okular, dry eye syndrome.',                         icon: 'Eye',      order: 8, is_active: false },
]

const EMPTY_FORM: Omit<ApplicationArea, 'id'> = {
  name: '', specialty: '', description: '', icon: '', order: 0, is_active: true,
}

export default function ApplicationAreas() {
  useSessionGuard()

  const [items, setItems] = useState<ApplicationArea[]>(DUMMY)
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<ApplicationArea, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

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

  const handleSave = () => {
    if (!form.name) return
    if (modal === 'edit' && editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { id: String(Date.now()), ...form }])
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus area ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_active: !i.is_active } : i))
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              {['Urutan', 'Nama Area', 'Spesialisasi', 'Deskripsi', 'Status', 'Aksi'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.sort((a, b) => a.order - b.order).map(item => (
              <tr key={item.id} className={cn('transition-colors', item.is_active ? 'hover:bg-muted/20' : 'opacity-50 hover:bg-muted/20')}>
                <td className="px-5 py-3.5 font-black text-muted-foreground">{item.order}</td>
                <td className="px-5 py-3.5 font-bold">{item.name}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground font-semibold">{item.specialty}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-xs truncate">{item.description}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleActive(item.id)} className="flex items-center gap-1.5 text-xs font-bold transition-colors">
                    {item.is_active
                      ? <><ToggleRight className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Aktif</span></>
                      : <><ToggleLeft className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Nonaktif</span></>
                    }
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
