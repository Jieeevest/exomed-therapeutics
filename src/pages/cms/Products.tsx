import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const DUMMY: Product[] = [
  { id: '1', name: 'EXOMED-AMNI-100M', series: 'amniotic',  nanoparticles: '100 Juta', type: 'MSC Amniotic Derived',                description: 'Formulasi standar untuk aplikasi regeneratif umum.',                        status: 'aktif' },
  { id: '2', name: 'EXOMED-AMNI-300M', series: 'amniotic',  nanoparticles: '300 Juta', type: 'MSC Amniotic Derived',                description: 'Konsentrasi menengah untuk ortopedi dan dermatologi.',                      status: 'aktif' },
  { id: '3', name: 'EXOMED-AMNI-500M', series: 'amniotic',  nanoparticles: '500 Juta', type: 'MSC Amniotic Derived — High Potency', description: 'Formulasi konsentrasi tinggi untuk kasus kompleks.',                        status: 'aktif' },
  { id: '4', name: 'EXOMED-CORD-100M', series: 'placental', nanoparticles: '100 Juta', type: 'Umbilical Cord MSC',                  description: 'Formulasi standar berbasis tali pusat umbilikal.',                          status: 'aktif' },
  { id: '5', name: 'EXOMED-CORD-300M', series: 'placental', nanoparticles: '300 Juta', type: 'Umbilical Cord MSC',                  description: 'Konsentrasi menengah untuk estetika dan dermatologi.',                      status: 'aktif' },
  { id: '6', name: 'EXOMED-CORD-NEURO', series: 'placental', nanoparticles: '150 Juta', type: 'Neural-Optimized (Placental Cord)', description: 'Dioptimalkan untuk aplikasi neurologi. Tersedia sebagai special order.', status: 'special_order' },
]

const STATUS_COLOR: Record<string, string> = {
  aktif:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  special_order:'bg-amber-500/10 text-amber-400 border-amber-500/20',
  nonaktif:     'bg-slate-500/10 text-slate-400 border-slate-500/20',
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

  const [items, setItems] = useState<Product[]>(DUMMY)
  const [tab, setTab] = useState<SeriesFilter>('semua')
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

  const visible = tab === 'semua' ? items : items.filter(i => i.series === tab)

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

  const handleSave = () => {
    if (!form.name || !form.nanoparticles || !form.type) return
    if (modal === 'edit' && editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { id: String(Date.now()), ...form }])
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <CmsLayout
      title="Produk"
      subtitle="Kelola varian produk exosome"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          {(['semua', 'amniotic', 'placental'] as SeriesFilter[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                tab === t ? 'bg-primary text-black' : 'text-slate-400 hover:text-white',
              )}
            >
              {t === 'amniotic' ? 'Amniotic Series' : t === 'placental' ? 'Placental Cord Series' : 'Semua'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(item => (
            <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-black uppercase border', STATUS_COLOR[item.status])}>
                  {STATUS_LABEL[item.status]}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                {item.series === 'amniotic' ? 'Amniotic Series' : 'Placental Cord Series'}
              </div>
              <h3 className="font-black text-base mb-0.5">{item.name}</h3>
              <div className="text-xs font-bold text-primary mb-0.5">{item.nanoparticles} Nanopartikel</div>
              <div className="text-[11px] text-slate-500 font-semibold mb-3">{item.type}</div>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{item.description}</p>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="col-span-3 py-16 text-center text-slate-500 text-sm">Belum ada produk pada series ini.</div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <FormField label="Nama Produk" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Series</label>
                  <select value={form.series} onChange={e => setForm(p => ({ ...p, series: e.target.value as Product['series'] }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-white">
                    <option value="amniotic">Amniotic Series</option>
                    <option value="placental">Placental Cord Series</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Product['status'] }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-white">
                    <option value="aktif">Aktif</option>
                    <option value="special_order">Special Order</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <FormField label="Jumlah Nanopartikel (mis. 100 Juta)" value={form.nanoparticles} onChange={v => setForm(p => ({ ...p, nanoparticles: v }))} />
              <FormField label="Tipe (mis. MSC Amniotic Derived)" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Deskripsi Singkat</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-white placeholder:text-white/20" />
              </div>
              <FormField label="URL Gambar Vial (opsional)" value={form.image_url ?? ''} onChange={v => setForm(p => ({ ...p, image_url: v }))} />
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

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-white placeholder:text-white/20" />
    </div>
  )
}
