import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, Lock, Search, Users, CreditCard, Ticket, BookOpen, BarChart2, Settings, Plus, Trash2, Eye } from 'lucide-react'

import { Button }      from '@/components/Button'
import { Input }       from '@/components/Input'
import { Textarea }    from '@/components/Textarea'
import { Select }      from '@/components/Select'
import { Alert }       from '@/components/Alert'
import { Badge }       from '@/components/Badge'
import { Spinner }     from '@/components/Spinner'
import { Modal }       from '@/components/Modal'
import { Card }        from '@/components/Card'
import { StatCard }    from '@/components/StatCard'
import { Table }       from '@/components/Table'
import { Pagination }  from '@/components/Pagination'
import { EmptyState }  from '@/components/EmptyState'
import { Avatar }      from '@/components/Avatar'
import { Tabs, TabContent } from '@/components/Tabs'
import { SidebarNav }  from '@/components/SidebarNav'
import { PageHeader }  from '@/components/PageHeader'

// ── Individual previews ───────────────────────────────────────────────────

function ButtonPreview() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}>
          {loading ? 'Loading...' : 'Click untuk loading'}
        </Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>
    </div>
  )
}

function InputPreview() {
  const [val, setVal] = useState('')
  return (
    <div className="space-y-4 max-w-md">
      <Input label="Email" type="email" placeholder="user@example.com" iconLeft={<Mail className="w-4 h-4" />} value={val} onChange={e => setVal(e.target.value)} />
      <Input label="Password" type="password" placeholder="••••••••" iconLeft={<Lock className="w-4 h-4" />} iconRight={<Eye className="w-4 h-4 cursor-pointer opacity-50" />} value="" onChange={() => {}} />
      <Input label="Username" placeholder="trader_one" value="" onChange={() => {}} error="Username sudah digunakan oleh akun lain." />
      <Input label="Kode Referral" placeholder="REF-XXXX" hint="Opsional — dapatkan bonus 10% untuk Anda dan pengundang." value="" onChange={() => {}} />
    </div>
  )
}

function TextareaPreview() {
  return (
    <div className="space-y-4 max-w-md">
      <Textarea label="Pesan" rows={3} placeholder="Tuliskan detail kendala Anda..." value="" onChange={() => {}} />
      <Textarea label="Konten Artikel" rows={4} resizable placeholder="Konten bisa di-resize..." value="" onChange={() => {}} />
      <Textarea label="Catatan" rows={2} value="" onChange={() => {}} error="Catatan wajib diisi." />
    </div>
  )
}

function SelectPreview() {
  const [single, setSingle] = useState<any>(null)
  const [multi, setMulti] = useState<any>([])
  const options = [
    { value: 'news',     label: 'Berita'    },
    { value: 'tutorial', label: 'Tutorial'  },
    { value: 'analysis', label: 'Analisis'  },
    { value: 'update',   label: 'Update'    },
  ]
  return (
    <div className="space-y-4 max-w-md">
      <Select label="Kategori (single)" options={options} value={single} onChange={setSingle} placeholder="Pilih kategori..." isClearable />
      <Select label="Tags (multi-select)" options={options} value={multi} onChange={setMulti} isMulti placeholder="Pilih beberapa..." />
      <Select label="Cari (searchable)" options={options} value={null} onChange={() => {}} isSearchable placeholder="Ketik untuk mencari..." />
    </div>
  )
}

function AlertPreview() {
  return (
    <div className="space-y-3 max-w-md">
      <Alert variant="success" message="Data berhasil disimpan ke database." />
      <Alert variant="error"   message="Terjadi kesalahan. Coba lagi beberapa saat." />
      <Alert variant="warning" message="Sesi Anda akan berakhir dalam 5 menit." />
      <Alert variant="info"    message="Update baru tersedia. Refresh halaman." />
    </div>
  )
}

function BadgePreview() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Failed</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="pro">PRO</Badge>
        <Badge variant="muted">Starter</Badge>
        <Badge variant="primary">Featured</Badge>
        <Badge variant="amber">Beta</Badge>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500">Size sm:</span>
        <Badge variant="success" size="sm">Live</Badge>
        <Badge variant="pro" size="sm">PRO</Badge>
        <Badge variant="warning" size="sm">Draft</Badge>
      </div>
    </div>
  )
}

function SpinnerPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-slate-500">sm</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-slate-500">md</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-slate-500">lg</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#111] rounded-xl flex flex-col items-center gap-2">
          <Spinner color="primary" />
          <span className="text-xs text-slate-500">primary</span>
        </div>
        <div className="p-3 bg-[#111] rounded-xl flex flex-col items-center gap-2">
          <Spinner color="white" />
          <span className="text-xs text-slate-500">white</span>
        </div>
        <div className="p-3 bg-white rounded-xl flex flex-col items-center gap-2">
          <Spinner color="black" />
          <span className="text-xs text-slate-500 text-black">black</span>
        </div>
      </div>
    </div>
  )
}

function ModalPreview() {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <div className="flex gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>Buka Modal Form</Button>
      <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Buka Konfirmasi</Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Profil" size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button><Button variant="primary">Simpan</Button></>}>
        <div className="space-y-4">
          <Input label="Nama" placeholder="Masukkan nama..." value="" onChange={() => {}} />
          <Input label="Email" type="email" placeholder="email@domain.com" value="" onChange={() => {}} />
          <Textarea label="Bio" rows={3} placeholder="Ceritakan tentang diri Anda..." value="" onChange={() => {}} />
        </div>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Konfirmasi Hapus" size="sm"
        footer={<><Button variant="ghost" onClick={() => setConfirmOpen(false)}>Batal</Button><Button variant="destructive">Hapus</Button></>}>
        <p className="text-slate-400 text-sm">Aksi ini tidak bisa dibatalkan. Data akan dihapus permanen.</p>
      </Modal>
    </div>
  )
}

function CardPreview() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-xl">
      <Card>
        <p className="text-sm text-slate-400">Card biasa dengan padding default.</p>
      </Card>
      <Card hover>
        <p className="text-sm text-slate-400">Card dengan hover glow effect.</p>
        <p className="text-xs text-slate-600 mt-1">Hover untuk melihat efek.</p>
      </Card>
      <Card hover className="col-span-2">
        <Card.Header>
          <h3 className="font-bold text-white text-sm">Card dengan Header & Footer</h3>
          <p className="text-xs text-slate-500 mt-0.5">Subtitle atau deskripsi singkat</p>
        </Card.Header>
        <p className="text-sm text-slate-400">Konten body card bisa berisi apapun — form, list, chart, dsb.</p>
        <Card.Footer>
          <Button variant="ghost" size="sm">Batal</Button>
          <Button variant="primary" size="sm">Simpan</Button>
        </Card.Footer>
      </Card>
    </div>
  )
}

function StatCardPreview() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Total Users" value="1,248" change="+12% bulan ini" up icon={<Users className="w-4 h-4 text-primary" />} accentColor="bg-primary/5" />
      <StatCard label="Revenue" value="Rp 4.2M" change="+8% bulan ini" up icon={<CreditCard className="w-4 h-4 text-emerald-400" />} accentColor="bg-emerald-500/5" />
      <StatCard label="Churn" value="3.2%" change="+0.5% bulan ini" up={false} icon={<BarChart2 className="w-4 h-4 text-red-400" />} accentColor="bg-red-500/5" />
    </div>
  )
}

const SAMPLE_USERS = [
  { id: '1', name: 'Budi Santoso',   email: 'budi@email.com',  tier: 'pro',     status: 'berhasil' },
  { id: '2', name: 'Citra Nadia',    email: 'citra@email.com', tier: 'starter', status: 'pending'  },
  { id: '3', name: 'Dimas Kurnia',   email: 'dimas@email.com', tier: 'pro',     status: 'gagal'    },
]

function TablePreview() {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Pengguna</Table.HeadCell>
        <Table.HeadCell>Paket</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {SAMPLE_USERS.map(u => (
          <Table.Row key={u.id}>
            <Table.Cell>
              <div className="font-bold text-white">{u.name}</div>
              <div className="text-xs text-slate-500">{u.email}</div>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={u.tier === 'pro' ? 'pro' : 'muted'}>{u.tier.toUpperCase()}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={u.status === 'berhasil' ? 'success' : u.status === 'pending' ? 'warning' : 'error'}>
                {u.status}
              </Badge>
            </Table.Cell>
            <Table.Cell className="text-right">
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost"><Eye className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

function PaginationPreview() {
  const [page, setPage] = useState(5)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-20">siblingCount=1</span>
        <Pagination page={page} totalPages={20} onPageChange={setPage} siblingCount={1} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-20">siblingCount=2</span>
        <Pagination page={page} totalPages={20} onPageChange={setPage} siblingCount={2} />
      </div>
      <p className="text-xs text-slate-600">Halaman aktif: {page} / 20 — klik angka untuk navigasi</p>
    </div>
  )
}

function EmptyStatePreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <EmptyState icon={<Search className="w-10 h-10" />} title="Tidak Ada Hasil" description="Coba ubah kata kunci pencarian Anda." />
      <EmptyState icon={<Ticket className="w-10 h-10" />} title="Belum Ada Tiket" description="Buat tiket pertama Anda sekarang." action={{ label: 'Buat Tiket', onClick: () => {} }} />
    </div>
  )
}

function AvatarPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Budi Santoso" size="sm" />
          <span className="text-[10px] text-slate-500">sm</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Budi Santoso" size="md" />
          <span className="text-[10px] text-slate-500">md</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Budi Santoso" size="lg" />
          <span className="text-[10px] text-slate-500">lg</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Budi Santoso" size="xl" />
          <span className="text-[10px] text-slate-500">xl</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {['Andi', 'Budi', 'Citra', 'Dimas', 'Eka', 'Fitra'].map(name => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <Avatar name={name} size="lg" />
            <span className="text-[10px] text-slate-500">{name[0]}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name="Admin" size="lg" useGold />
          <span className="text-[10px] text-slate-500">gold</span>
        </div>
      </div>
    </div>
  )
}

function TabsPreview() {
  const [tab1, setTab1] = useState('profile')
  const [tab2, setTab2] = useState('login')
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <p className="text-xs text-slate-500 mb-2">variant="underline"</p>
        <Tabs variant="underline" tabs={[
          { id: 'profile',  label: 'Profil',     icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'billing',  label: 'Billing',    icon: <CreditCard className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-3.5 h-3.5" /> },
        ]} value={tab1} onValueChange={setTab1}>
          <TabContent value="profile"  className="pt-4 text-sm text-slate-400">Konten tab Profil</TabContent>
          <TabContent value="billing"  className="pt-4 text-sm text-slate-400">Konten tab Billing</TabContent>
          <TabContent value="settings" className="pt-4 text-sm text-slate-400">Konten tab Pengaturan</TabContent>
        </Tabs>
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">variant="pill"</p>
        <Tabs variant="pill" tabs={[
          { id: 'login',    label: 'LOGIN'    },
          { id: 'register', label: 'REGISTER' },
        ]} value={tab2} onValueChange={setTab2}>
          <TabContent value="login"    className="pt-4 text-sm text-slate-400">Form login</TabContent>
          <TabContent value="register" className="pt-4 text-sm text-slate-400">Form register</TabContent>
        </Tabs>
      </div>
    </div>
  )
}

function SidebarNavPreview() {
  const [active, setActive] = useState('users')
  return (
    <div className="w-56 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Menu Admin</p>
      <SidebarNav
        items={[
          { id: 'users',    label: 'User Management', icon: Users    },
          { id: 'payments', label: 'Transactions',     icon: CreditCard },
          { id: 'tickets',  label: 'Support Tickets',  icon: Ticket   },
          { id: 'articles', label: 'Content & CMS',    icon: BookOpen },
        ]}
        activeId={active}
        onSelect={setActive}
      />
    </div>
  )
}

function PageHeaderPreview() {
  return (
    <div className="space-y-4">
      <div className="border border-white/5 rounded-xl p-4">
        <PageHeader title="User Management" description="Kelola semua pengguna dan role mereka." action={
          <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Tambah User</Button>
        } />
      </div>
      <div className="border border-white/5 rounded-xl p-4">
        <PageHeader title="Laporan Bulanan" />
      </div>
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────

const PREVIEWS: Record<string, { label: string; height: number; render: () => JSX.Element }> = {
  button:      { label: 'Button',      height: 160, render: ButtonPreview      },
  input:       { label: 'Input',       height: 380, render: InputPreview       },
  textarea:    { label: 'Textarea',    height: 320, render: TextareaPreview    },
  select:      { label: 'Select',      height: 280, render: SelectPreview      },
  alert:       { label: 'Alert',       height: 220, render: AlertPreview       },
  badge:       { label: 'Badge',       height: 100, render: BadgePreview       },
  spinner:     { label: 'Spinner',     height: 150, render: SpinnerPreview     },
  modal:       { label: 'Modal',       height: 80,  render: ModalPreview       },
  card:        { label: 'Card',        height: 280, render: CardPreview        },
  statcard:    { label: 'StatCard',    height: 120, render: StatCardPreview    },
  table:       { label: 'Table',       height: 220, render: TablePreview       },
  pagination:  { label: 'Pagination',  height: 120, render: PaginationPreview  },
  emptystate:  { label: 'EmptyState',  height: 340, render: EmptyStatePreview  },
  avatar:      { label: 'Avatar',      height: 140, render: AvatarPreview      },
  tabs:        { label: 'Tabs',        height: 260, render: TabsPreview        },
  sidebarnav:  { label: 'SidebarNav',  height: 230, render: SidebarNavPreview  },
  pageheader:  { label: 'PageHeader',  height: 220, render: PageHeaderPreview  },
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ComponentPreview() {
  const [params] = useSearchParams()
  const id = params.get('id')

  if (id) {
    const item = PREVIEWS[id]
    if (!item) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-slate-500 text-sm">Preview "{id}" tidak ditemukan.</div>
    const Preview = item.render
    return (
      <div className="bg-[#0a0a0a] p-6 min-h-screen">
        <Preview />
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen p-8">
      <h1 className="text-2xl font-black mb-2">Component Preview</h1>
      <p className="text-slate-500 text-sm mb-10">Akses individual: <code className="text-primary">/preview?id=button</code></p>
      {Object.entries(PREVIEWS).map(([key, item]) => {
        const Preview = item.render
        return (
          <section key={key} id={key} className="mb-12">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">{key}</span> — {item.label}
            </h2>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <Preview />
            </div>
          </section>
        )
      })}
    </div>
  )
}
