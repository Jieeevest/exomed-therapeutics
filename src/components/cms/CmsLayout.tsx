import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Package, MapPin,
  FlaskConical, GitBranch, FileText, BookOpen,
  Settings, Sliders, Users, ExternalLink, ChevronRight, UserCheck,
  LogOut, KeyRound, X, Check, AlertCircle,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/store/useAuth'
import { fetchWithAuth } from '@/lib/api'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Operasional',
    items: [
      { path: '/cms',            label: 'Dashboard',            icon: LayoutDashboard },
      { path: '/cms/inquiries',  label: 'Inquiry & Konsultasi', icon: MessageSquare },
      { path: '/cms/users',      label: 'Manajemen Klien',      icon: UserCheck },
    ],
  },
  {
    label: 'Konten Publik',
    items: [
      { path: '/cms/products',          label: 'Produk',             icon: Package },
      { path: '/cms/application-areas', label: 'Area Aplikasi',      icon: MapPin },
      { path: '/cms/case-studies',      label: 'Studi Kasus',        icon: FlaskConical },
      { path: '/cms/pipeline',          label: 'Pipeline Penelitian', icon: GitBranch },
    ],
  },
  {
    label: 'Dokumen & Edukasi',
    items: [
      { path: '/cms/documents', label: 'Dokumen & COA', icon: FileText },
      { path: '/cms/articles',  label: 'Artikel',       icon: BookOpen },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { path: '/cms/page-settings',    label: 'Pengaturan Halaman', icon: Settings },
      { path: '/cms/general-settings', label: 'Pengaturan Umum',    icon: Sliders },
      { path: '/cms/admin-users',      label: 'Manajemen Admin',    icon: Users },
    ],
  },
]

interface CmsLayoutProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function CmsLayout({ title, subtitle, action, children }: CmsLayoutProps) {
  const { user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()

  const [dropdownOpen, setDropdownOpen]   = useState(false)
  const [pwModal, setPwModal]             = useState(false)
  const [oldPw, setOldPw]                 = useState('')
  const [newPw, setNewPw]                 = useState('')
  const [confirmPw, setConfirmPw]         = useState('')
  const [pwMsg, setPwMsg]                 = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [savingPw, setSavingPw]           = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Password baru tidak cocok.' }); return }
    if (newPw.length < 8)    { setPwMsg({ type: 'error', text: 'Password minimal 8 karakter.' }); return }
    setSavingPw(true)
    setPwMsg(null)
    try {
      const res  = await fetchWithAuth('/api/auth/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      })
      const data = await res.json()
      if (data.success) {
        setPwMsg({ type: 'success', text: 'Password berhasil diubah.' })
        setOldPw(''); setNewPw(''); setConfirmPw('')
      } else {
        setPwMsg({ type: 'error', text: data.message })
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Full-width top navbar */}
      <header className="shrink-0 border-b border-border bg-card flex items-center px-5 gap-4 h-[68px]">
        <Logo className="h-11 w-auto" variant="horizontal" />
        <div className="flex-1" />
        <ThemeToggle />

        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 bg-background border border-border rounded-full pl-2 pr-4 py-1.5 hover:bg-muted/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
              {user?.username?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="text-xs text-left">
              <div className="font-bold text-foreground leading-tight">{user?.username ?? 'Admin'}</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Admin</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3 py-2 border-b border-border mb-1">
                <div className="text-xs font-bold text-foreground">{user?.username}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <button
                onClick={() => { setDropdownOpen(false); setPwMsg(null); setPwModal(true) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <KeyRound className="w-4 h-4" /> Ganti Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Change password modal */}
      {pwModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setPwModal(false) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-foreground">Ganti Password</h2>
              <button onClick={() => setPwModal(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleChangePassword} className="p-5 space-y-3">
              {[
                { label: 'Password Lama',            val: oldPw,     set: setOldPw },
                { label: 'Password Baru',            val: newPw,     set: setNewPw },
                { label: 'Konfirmasi Password Baru', val: confirmPw, set: setConfirmPw },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">{label}</label>
                  <input
                    type="password"
                    value={val}
                    onChange={e => set(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              ))}
              {pwMsg && (
                <div className={cn('flex items-center gap-2 text-xs px-3 py-2 rounded-lg', pwMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600')}>
                  {pwMsg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {pwMsg.text}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setPwModal(false)} className="flex-1 py-2 bg-muted/30 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors">Batal</button>
                <button type="submit" disabled={savingPw} className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50">
                  <KeyRound className="w-4 h-4" />
                  {savingPw ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 overflow-y-auto">

        <nav className="flex-1 p-3 space-y-5 pt-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-xs font-black text-muted-foreground/50 uppercase tracking-widest mb-1.5 px-3">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                        isActive
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="leading-none">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Halaman Publik
          </a>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
          <div className="px-8 pt-6 pb-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/cms" className="hover:text-foreground transition-colors">CMS</Link>
              {location.pathname !== '/cms' && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                  <span className="text-foreground font-semibold">{title}</span>
                </>
              )}
            </div>
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          </div>
          <div className="px-8 pb-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

