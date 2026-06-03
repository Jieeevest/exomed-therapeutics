import { useState } from 'react'
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { CaseStudy, CaseStudyMetric, CaseStudyImage } from '@/types'

const DUMMY: CaseStudy[] = [
  {
    id: '1', specialty: 'Neurologi',
    title: 'Tik Wajah & Gerakan Involunter',
    patient_description: 'Pasien dengan tik wajah (gerakan involunter) dan nyeri.',
    metrics: [
      { label: 'Respons awal — reduksi tik langsung', value: '20 detik' },
      { label: 'Kunjungan ke-3 — resolusi bertahan, tidak ada nyeri', value: '3 minggu' },
    ],
    disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
    is_published: true, created_at: '2026-05-01T00:00:00Z',
  },
  {
    id: '2', specialty: 'Dermatologi',
    title: 'Psoriasis Berat — Full Body Coverage',
    patient_description: 'Pasien 37 tahun · >95% BSA terdampak · Treatment: ExoTher 1 Miliar Nanopartikel.',
    metrics: [
      { label: 'BSA terdampak sebelum treatment', value: '>95% BSA' },
      { label: 'Near-complete skin clearance pasca ExoTher', value: '2 Minggu' },
    ],
    disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
    is_published: true, created_at: '2026-04-15T00:00:00Z',
  },
  {
    id: '3', specialty: 'Neurologi',
    title: 'Pemulihan Stroke Hemoragik',
    patient_description: 'Pasien kursi roda dengan paralisis tungkai bawah — protokol treatment exosome 2 bulan.',
    metrics: [
      { label: 'Durasi treatment hingga ambulasi', value: '2 Bulan' },
      { label: 'Pasien berjalan dengan bantuan tongkat pasca-treatment', value: 'Ambulatori' },
    ],
    disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
    is_published: true, created_at: '2026-04-01T00:00:00Z',
  },
  {
    id: '4', specialty: 'Ortopedi',
    title: 'Osteoartritis Lutut (OA)',
    patient_description: 'Peningkatan ruang sendi radiografis pada 1 bulan · Skala nyeri VRS mendekati nol pada 6 bulan.',
    metrics: [
      { label: 'Peningkatan ruang sendi terlihat di X-ray', value: '1 Bulan' },
      { label: 'Bebas nyeri saat istirahat & aktivitas — bertahan hingga 6 bulan', value: 'VRS Score 0' },
    ],
    disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
    is_published: true, created_at: '2026-03-15T00:00:00Z',
  },
  {
    id: '5', specialty: 'Neurologi Anak',
    title: 'Palsi Serebral — Kasus Pediatrik',
    patient_description: 'Pasien Syamil — Peningkatan ketahanan duduk dan kekuatan inti dari Hari ke-3.',
    metrics: [
      { label: 'Hari ke-3', value: 'Ketahanan duduk meningkat — dari 5 menit ke periode bertahan tanpa kelelahan' },
      { label: 'Motorik', value: 'Perbaikan aktivasi otot inti terlihat; fisioterapi berjalan bersamaan dengan treatment' },
      { label: 'Neurologis', value: 'Tidak ada episode sakit kepala berat selama periode observasi' },
      { label: 'Adverse Events', value: 'Ruam wajah transien ringan — self-resolving, tidak mengkhawatirkan' },
    ],
    disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
    is_published: false, created_at: '2026-03-01T00:00:00Z',
  },
]

const EMPTY_FORM: Omit<CaseStudy, 'id' | 'created_at'> = {
  specialty: '', title: '', patient_description: '',
  images: [],
  metrics: [{ label: '', value: '' }],
  disclaimer: 'Data observasional. Bukan RCT. Tidak dimaksudkan sebagai klaim efektivitas.',
  is_published: false,
}

export default function CaseStudies() {
  useSessionGuard()

  const [items, setItems] = useState<CaseStudy[]>(DUMMY)
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm] = useState<Omit<CaseStudy, 'id' | 'created_at'>>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)

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

  const handleSave = () => {
    if (!form.title || !form.specialty) return
    if (modal === 'edit' && editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { id: String(Date.now()), created_at: new Date().toISOString(), ...form }])
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus studi kasus ini?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const togglePublish = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_published: !i.is_published } : i))
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              {['Spesialisasi', 'Judul', 'Metrik', 'Status', 'Aksi'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
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
                <td className="px-5 py-4 text-xs text-muted-foreground">{item.metrics.length} metrik · {(item.images ?? []).length} gambar</td>
                <td className="px-5 py-4">
                  <button onClick={() => togglePublish(item.id)} className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-black uppercase border transition-all',
                    item.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-muted-foreground border-slate-500/20',
                  )}>
                    {item.is_published ? 'Publish' : 'Draft'}
                  </button>
                </td>
                <td className="px-5 py-4">
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
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'create' ? 'Tambah Studi Kasus' : 'Edit Studi Kasus'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <Field label="Spesialisasi" value={form.specialty} onChange={v => setForm(p => ({ ...p, specialty: v }))} />
              <Field label="Judul Studi Kasus" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Deskripsi Pasien / Metode</label>
                <textarea rows={3} value={form.patient_description} onChange={e => setForm(p => ({ ...p, patient_description: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground placeholder:text-muted-foreground/30" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Gambar (URL)</label>
                  <button onClick={addImage} className="flex items-center gap-1 text-xs text-primary hover:underline"><PlusCircle className="w-3.5 h-3.5" /> Tambah Gambar</button>
                </div>
                <div className="space-y-2">
                  {(form.images ?? []).map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input placeholder="URL gambar (mis. /case-images/foto.jpg)" value={img.src} onChange={e => updateImage(idx, 'src', e.target.value)} className="flex-[2] bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      <input placeholder="Caption (mis. Pre-treatment)" value={img.caption} onChange={e => updateImage(idx, 'caption', e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      <button onClick={() => removeImage(idx)} className="text-muted-foreground hover:text-red-400 transition-colors"><MinusCircle className="w-4 h-4" /></button>
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
                      <input placeholder="Label (mis. VAS Score)" value={m.label} onChange={e => updateMetric(idx, 'label', e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      <input placeholder="Nilai (mis. −4.1 poin)" value={m.value} onChange={e => updateMetric(idx, 'value', e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/30" />
                      {form.metrics.length > 1 && (
                        <button onClick={() => removeMetric(idx)} className="text-muted-foreground hover:text-red-400 transition-colors"><MinusCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Disclaimer</label>
                <textarea rows={2} value={form.disclaimer} onChange={e => setForm(p => ({ ...p, disclaimer: e.target.value }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-foreground" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="rounded" />
                Publish (tampil di halaman publik)
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
