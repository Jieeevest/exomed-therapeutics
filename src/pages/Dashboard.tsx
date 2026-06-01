import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels'
import {
  LayoutDashboard, BarChart2, Settings, List,
  LogOut, ShieldAlert, User, Crown, Ticket
} from 'lucide-react'

import { useAuth } from '@/store/useAuth'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { Logo } from '@/components/Logo'
import { ProGate } from '@/components/ProGate'
import { cn } from '@/lib/utils'

type RightTab = 'activity' | 'stats' | 'pro'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useSessionGuard()

  const [activeNav, setActiveNav] = useState('overview')
  const [rightTab, setRightTab] = useState<RightTab>('activity')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NAV_ITEMS = [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 mr-2">
          <Logo className="h-8 w-auto" variant="horizontal" />
        </div>

        <div className="w-px h-4 bg-border" />

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Online
        </div>

        <button
          onClick={() => navigate('/support')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md border border-primary/20"
        >
          <Ticket className="w-3.5 h-3.5" /> Support
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none">
              <span className="text-xs font-bold text-white mb-0.5">{user?.username || 'User'}</span>
              <span className={cn(
                'text-[9px] font-bold tracking-wider uppercase',
                user?.subscription_tier === 'pro' ? 'text-purple-400' : 'text-slate-500'
              )}>
                {user?.subscription_tier || 'STARTER'}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-white/5 mb-1">
                  <div className="text-sm font-semibold text-white truncate">{user?.username}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>

                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <ShieldAlert className="w-4 h-4" /> Admin Panel
                  </button>
                )}

                <button onClick={() => navigate('/articles')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <List className="w-4 h-4" /> Articles
                </button>

                <button onClick={() => navigate('/support')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <Ticket className="w-4 h-4" /> Support
                </button>

                <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </button>

                <div className="h-px bg-white/5 my-1" />

                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main layout */}
      <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">

        {/* LEFT — Sidebar nav */}
        <Panel defaultSize="20" minSize="15" maxSize="30" className="flex flex-col">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 mx-[-1px] z-10 flex items-center justify-center cursor-col-resize group bg-transparent">
          <div className="w-[1px] h-full bg-border group-hover:bg-primary transition-colors" />
        </PanelResizeHandle>

        {/* CENTER — Main content */}
        <Panel defaultSize="55" minSize="30" className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-card shrink-0">
            <span className="font-bold text-foreground text-sm capitalize">{activeNav}</span>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Users',  value: '1,248', change: '+12%', up: true  },
                { label: 'Revenue',      value: 'Rp 4.2M', change: '+8%', up: true  },
                { label: 'Active Today', value: '342',   change: '-3%', up: false },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{stat.label}</div>
                  <div className="text-3xl font-black text-foreground">{stat.value}</div>
                  <div className={cn('text-xs font-semibold mt-1.5', stat.up ? 'text-green-400' : 'text-red-400')}>
                    {stat.change} vs last month
                  </div>
                </div>
              ))}
            </div>

            {/* Main content area — replace with your components */}
            <div className="bg-card border border-border rounded-xl min-h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Main Content Area</p>
                <p className="text-xs mt-1 opacity-60">Ganti dengan konten aplikasi Anda</p>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 mx-[-1px] z-10 flex items-center justify-center cursor-col-resize group bg-transparent">
          <div className="w-[1px] h-full bg-border group-hover:bg-primary transition-colors" />
        </PanelResizeHandle>

        {/* RIGHT — Tabbed side panel */}
        <Panel defaultSize="25" minSize="20" maxSize="40" className="flex flex-col overflow-hidden">
          <div className="flex border-b border-border">
            {([
              { id: 'activity', label: 'Activity', pro: false },
              { id: 'stats',    label: 'Stats',    pro: false },
              { id: 'pro',      label: 'Pro',      pro: true  },
            ] as { id: RightTab; label: string; pro: boolean }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors relative',
                  rightTab === tab.id
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                {tab.pro && user?.subscription_tier !== 'pro' && (
                  <Crown className="h-2 w-2 text-yellow-500 absolute top-1 right-1" />
                )}
              </button>
            ))}
          </div>

          {rightTab === 'pro' ? (
            <div className="flex-1 overflow-hidden">
              <ProGate feature="fitur Pro ini">
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 bg-card border border-border rounded-lg text-xs text-muted-foreground">
                      Pro feature item {i + 1}
                    </div>
                  ))}
                </div>
              </ProGate>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rightTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 space-y-1"
                >
                  {rightTab === 'activity' ? (
                    [...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                        <div className="text-xs text-muted-foreground flex-1">Activity item {i + 1}</div>
                        <div className="text-[10px] text-muted-foreground/50">{i + 1}m ago</div>
                      </div>
                    ))
                  ) : (
                    [...Array(6)].map((_, i) => (
                      <div key={i} className="p-3 bg-card border border-border rounded-lg">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-foreground">Metric {i + 1}</span>
                          <span className="text-primary">{40 + i * 10}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-primary/60"
                            style={{ width: `${40 + i * 10}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </Panel>
      </PanelGroup>
    </div>
  )
}
