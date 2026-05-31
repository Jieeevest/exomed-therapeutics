import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Package, MapPin,
  FlaskConical, GitBranch, FileText, BookOpen,
  Settings, Sliders, Users, ExternalLink, Shield, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'
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
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-auto" variant="icon" />
            <div>
              <div className="font-black text-sm leading-tight text-foreground">Exomed CMS</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Content Manager
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-1.5 px-3">
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

        <div className="p-3 border-t border-border space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Halaman Publik
          </a>
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin Panel Lama
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {action}
            <ThemeToggle />
            <div className="flex items-center gap-2 bg-card border border-border rounded-full pl-2 pr-4 py-1.5 ms-1">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                {user?.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="text-xs">
                <div className="font-bold text-foreground leading-tight">{user?.username ?? 'Admin'}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
