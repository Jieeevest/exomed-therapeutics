import { useState } from 'react'
import { Search, X, Download } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { Inquiry } from '@/types'

const DUMMY: Inquiry[] = [
  { id: '1', name: 'dr. Ahmad Fauzi, SpOT',    specialty: 'Ortopedi',       clinic: 'RS Husada Utama',       city: 'Jakarta',   whatsapp: '081234000001', product_interest: 'EXOMED-AMNI-300M',   message: 'Ingin mengetahui protokol untuk OA lutut grade II.', status: 'baru',     created_at: '2026-05-31T09:14:00Z' },
  { id: '2', name: 'dr. Siti Rahayu, SpKK',    specialty: 'Dermatologi',    clinic: 'Klinik Estetika Sehat', city: 'Bandung',   whatsapp: '081234000002', product_interest: 'EXOMED-CORD-300M',   message: 'Tertarik untuk wound healing dan anti-aging.', status: 'diproses', created_at: '2026-05-31T08:52:00Z' },
  { id: '3', name: 'dr. Budi Santoso, SpN',    specialty: 'Neurologi',      clinic: 'RSUP dr. Sardjito',     city: 'Yogyakarta',whatsapp: '081234000003', product_interest: 'EXOMED-CORD-NEURO',  message: 'Apakah tersedia untuk aplikasi neurologi klinis?', status: 'baru',     created_at: '2026-05-31T08:31:00Z' },
  { id: '4', name: 'dr. Dewi Lestari',          specialty: 'Umum',           clinic: 'Klinik Prima',          city: 'Surabaya',  whatsapp: '081234000004', product_interest: 'EXOMED-AMNI-100M',   message: '',                                            status: 'selesai',  notes: 'Sudah dikirim brosur dan info harga.', created_at: '2026-05-30T14:20:00Z' },
  { id: '5', name: 'dr. Rudi Hartono, SpOG',   specialty: 'Obstetri Ginekologi', clinic: 'RS Bunda',         city: 'Jakarta',   whatsapp: '081234000005', product_interest: 'EXOMED-AMNI-500M',   message: 'Ingin tahu aplikasi untuk andrologi.', status: 'diproses', created_at: '2026-05-30T11:05:00Z' },
  { id: '6', name: 'dr. Farida Hanum, SpM',    specialty: 'Oftalmologi',    clinic: 'Klinik Mata Cerah',     city: 'Medan',     whatsapp: '081234000006', product_interest: 'EXOMED-CORD-100M',   message: 'Dry eye syndrome management.', status: 'baru',     created_at: '2026-05-29T16:44:00Z' },
]

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
  const [items, setItems] = useState<Inquiry[]>(DUMMY)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')

  const visible = items.filter(item => {
    const matchStatus = filter === 'semua' || item.status === filter
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.clinic.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const updateStatus = (id: string, status: Inquiry['status']) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const saveNotes = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, notes } : null)
  }

  const openDetail = (item: Inquiry) => {
    setSelected(item)
    setNotes(item.notes ?? '')
  }

  const counts = {
    semua: items.length,
    baru: items.filter(i => i.status === 'baru').length,
    diproses: items.filter(i => i.status === 'diproses').length,
    selesai: items.filter(i => i.status === 'selesai').length,
  }

  return (
    <CmsLayout
      title="Inquiry & Konsultasi"
      subtitle="Semua submission dari form konsultasi halaman publik"
      action={
        <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.10] text-sm font-bold rounded-xl hover:bg-white/[0.09] transition-colors">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            {STATUS_OPTS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                  filter === s ? 'bg-primary text-black' : 'text-slate-400 hover:text-white',
                )}
              >
                {s} ({counts[s]})
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau klinik..."
              className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-xl text-sm outline-none focus:border-primary/40 transition-colors text-white placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                <tr>
                  {['Nama & Profesi', 'Klinik / Kota', 'Produk', 'Tanggal', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {visible.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.specialty}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-300">{item.clinic}</div>
                      <div className="text-xs text-slate-500">{item.city}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{item.product_interest}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border', STATUS_COLOR[item.status])}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">Tidak ada inquiry ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h2 className="font-black text-lg">{selected.name}</h2>
                <div className="text-xs text-slate-500 mt-0.5">{selected.specialty} &bull; {selected.clinic}, {selected.city}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-xl leading-none"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-slate-600 mb-0.5">WhatsApp</div><a href={`https://wa.me/${selected.whatsapp}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{selected.whatsapp}</a></div>
                <div><div className="text-xs text-slate-600 mb-0.5">Produk Diminati</div><span className="font-mono text-xs">{selected.product_interest}</span></div>
              </div>

              {selected.message && (
                <div>
                  <div className="text-xs text-slate-600 mb-1">Pesan</div>
                  <p className="text-sm text-slate-300 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">{selected.message}</p>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-600 mb-1.5">Ubah Status</div>
                <div className="flex gap-2">
                  {(['baru', 'diproses', 'selesai'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-black uppercase border transition-all',
                        selected.status === s ? STATUS_COLOR[s] : 'text-slate-500 border-white/[0.08] hover:border-white/20',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-600 mb-1.5">Catatan Internal</div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tambah catatan untuk tim..."
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none text-white placeholder:text-white/20"
                />
                <button
                  onClick={() => saveNotes(selected.id)}
                  className="mt-2 px-4 py-1.5 bg-primary text-black text-xs font-black rounded-lg hover:opacity-90 transition-opacity"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CmsLayout>
  )
}
