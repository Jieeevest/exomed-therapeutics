import { Link } from 'react-router-dom'
import { MessageSquare, Package, BookOpen, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Total Inquiry',      value: 24, icon: MessageSquare, color: 'text-blue-500',    bg: 'bg-blue-500/10',    link: '/cms/inquiries' },
  { label: 'Inquiry Hari Ini',   value: 3,  icon: TrendingUp,   color: 'text-emerald-500', bg: 'bg-emerald-500/10', link: '/cms/inquiries' },
  { label: 'Produk Aktif',       value: 6,  icon: Package,      color: 'text-primary',      bg: 'bg-primary/10',     link: '/cms/products'  },
  { label: 'Artikel Terpublish', value: 8,  icon: BookOpen,     color: 'text-purple-500',  bg: 'bg-purple-500/10', link: '/cms/articles'  },
]

const RECENT = [
  { id: '1', name: 'dr. Ahmad Fauzi, SpOT',   clinic: 'RS Husada Utama',       product: 'EXOMED-AMNI-300M',   status: 'baru',     time: '09:14' },
  { id: '2', name: 'dr. Siti Rahayu, SpKK',   clinic: 'Klinik Estetika Sehat', product: 'EXOMED-CORD-300M',   status: 'diproses', time: '08:52' },
  { id: '3', name: 'dr. Budi Santoso, SpN',   clinic: 'RSUP dr. Sardjito',     product: 'EXOMED-CORD-NEURO',  status: 'baru',     time: '08:31' },
  { id: '4', name: 'dr. Dewi Lestari',         clinic: 'Klinik Prima',          product: 'EXOMED-AMNI-100M',   status: 'selesai',  time: 'Kemarin' },
  { id: '5', name: 'dr. Rudi Hartono, SpOG',  clinic: 'RS Bunda',              product: 'EXOMED-AMNI-500M',   status: 'diproses', time: 'Kemarin' },
]

const STATUS_COLOR: Record<string, string> = {
  baru:     'bg-blue-500/10 text-blue-500 border-blue-500/20',
  diproses: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  selesai:  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
}

const SHORTCUTS = [
  { label: 'Lihat Semua Inquiry', path: '/cms/inquiries', icon: MessageSquare },
  { label: 'Kelola Produk',       path: '/cms/products',  icon: Package },
  { label: 'Tambah Artikel Baru', path: '/cms/articles',  icon: BookOpen },
]

export default function CmsDashboard() {
  useSessionGuard()

  return (
    <CmsLayout title="Dashboard" subtitle="Ringkasan aktivitas hari ini">
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <Link
              key={s.label}
              to={s.link}
              className="p-5 bg-card border border-border rounded-2xl hover:border-border/80 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-black text-foreground mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <div className="font-black text-sm text-foreground">Inquiry Terbaru</div>
              <Link to="/cms/inquiries" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {RECENT.map(r => (
                <div key={r.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.clinic} &bull; {r.product}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-black uppercase border ${STATUS_COLOR[r.status]}`}>
                      {r.status}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {r.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="font-black text-sm text-foreground mb-4">Akses Cepat</div>
            <div className="space-y-1">
              {SHORTCUTS.map(s => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all border border-transparent hover:border-border"
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CmsLayout>
  )
}
