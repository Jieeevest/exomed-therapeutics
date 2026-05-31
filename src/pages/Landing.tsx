import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Shield, Activity, BarChart2, ArrowRight,
  ChevronRight, Check, Star, Globe, Cpu,
  Twitter, Github, Send, Menu, X, Clock, Eye,
  Users, Zap, Lock, MapPin, Mail, Phone, Layers, Database
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { Logo } from '@/components/Logo'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Counter animation hook ────────────────────────────────────────────────
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  const start = (fromZero = true) => {
    if (fromZero) setCount(0)
    const step = target / (duration / 16)
    ref.current = setInterval(() => {
      setCount(prev => {
        const next = prev + step
        if (next >= target) { clearInterval(ref.current!); return target }
        return next
      })
    }, 16)
  }
  useEffect(() => () => { if (ref.current) clearInterval(ref.current) }, [])
  return { count: Math.floor(count), start }
}

// ── Stat Counter ─────────────────────────────────────────────────────────
function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const { count, start } = useCounter(value, 2200)
  useEffect(() => { if (inView) start() }, [inView])
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-2 font-medium">{label}</div>
    </div>
  )
}

// ── Feature Card ─────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-300 overflow-hidden flex flex-col min-h-[200px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-amber-500/40 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{desc}</p>
      </div>
    </motion.div>
  )
}

// ── Pricing Card ─────────────────────────────────────────────────────────
function PricingCard({ plan, price, priceNote, features, highlight, badge, cta }: {
  plan: string; price: string; priceNote?: string; features: string[]; highlight?: boolean; badge?: string; cta?: string
}) {
  const { isAuthenticated, accessToken } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (plan === 'Enterprise') {
      navigate('/support')
      return
    }
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (plan !== 'Pro') {
      navigate('/app')
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch(API_URL + '/api/payment/subscribe', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (data.success && data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl
      } else {
        alert('Gagal generate link pembayaran: ' + data.message)
      }
    } catch {
      alert('Terjadi kesalahan saat memproses pembayaran.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`relative rounded-2xl p-8 border flex flex-col ${highlight
      ? 'bg-gradient-to-b from-amber-950/60 to-black border-amber-500/50 shadow-[0_0_60px_rgba(245,166,35,0.15)]'
      : 'bg-white/[0.03] border-white/[0.1] text-white'}`}>
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-gradient text-black text-xs font-black px-5 py-1.5 rounded-full whitespace-nowrap">
          ⭐ {badge}
        </div>
      )}
      <p className={`text-xs font-black tracking-widest uppercase mb-4 ${highlight ? 'text-amber-400' : 'text-slate-400'}`}>{plan}</p>
      <div className={`text-5xl font-black mb-1 ${highlight ? 'text-white' : 'text-white'}`}>{price}</div>
      <p className={`text-sm mb-8 ${highlight ? 'text-amber-300/60' : 'text-slate-500'}`}>{priceNote || 'per bulan'}</p>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlight ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={highlight ? 'text-slate-200' : 'text-slate-300'}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group disabled:opacity-70 ${highlight
          ? 'bg-gold-gradient text-black hover:opacity-90 shadow-[0_0_30px_rgba(245,166,35,0.3)]'
          : 'bg-white/[0.07] border border-white/[0.15] text-white hover:bg-white/[0.12]'}`}
      >
        {isLoading ? 'Memproses...' : (cta || 'Mulai Sekarang')}
        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  )
}

// ── Feature Marquee ───────────────────────────────────────────────────────
const FEATURES_MARQUEE = [
  { label: 'Authentication',   dot: true  },
  { label: 'Role Management',  dot: false },
  { label: 'Subscription',     dot: true  },
  { label: 'Admin Dashboard',  dot: false },
  { label: 'Article CMS',      dot: true  },
  { label: 'Support Tickets',  dot: false },
  { label: 'Payment Gateway',  dot: true  },
  { label: 'Real-time Data',   dot: false },
  { label: 'Session Guard',    dot: true  },
  { label: 'Dark Mode UI',     dot: false },
]

function FeatureMarquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/[0.06] bg-black/40 py-3">
      <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap pr-8">
        {[...FEATURES_MARQUEE, ...FEATURES_MARQUEE].map((f, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono">
            {f.dot
              ? <span className="text-emerald-400">✦</span>
              : <span className="text-amber-400">◆</span>}
            <span className="text-slate-300">{f.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Landing Page ─────────────────────────────────────────────────────
export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(5,5,5,0.95)'])
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)'])

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float-anim{animation:float 6s ease-in-out infinite}
        .float-anim-slow{animation:float 8s ease-in-out infinite}
      `}</style>

      {/* ── NAVBAR ── */}
      <motion.nav
        style={{ backgroundColor: navBg, borderColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center shrink-0">
              <Logo variant="horizontal" className="h-9 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-sm text-slate-400 hover:text-white transition-colors">Fitur</a>
              <a href="#cara-kerja" className="text-sm text-slate-400 hover:text-white transition-colors">Cara Kerja</a>
              <a href="#harga" className="text-sm text-slate-400 hover:text-white transition-colors">Harga</a>
              <Link to="/articles" className="text-sm text-slate-400 hover:text-white transition-colors">Artikel</Link>
              <Link to="/support" className="text-sm text-slate-400 hover:text-white transition-colors">Support</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/app"
                  className="flex items-center gap-2 text-sm font-bold bg-gold-gradient text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2 transition-colors">
                    Masuk
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm font-bold bg-gold-gradient text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95"
                  >
                    Coba Gratis
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu btn */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden text-slate-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Fitur</a>
                <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Cara Kerja</a>
                <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Harga</a>
                <Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Artikel</Link>
                <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Support</Link>
                {isAuthenticated ? (
                  <Link to="/app" onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-gold-gradient text-black text-sm font-bold py-3 rounded-xl mt-2">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-gold-gradient text-black text-sm font-bold py-3 rounded-xl mt-2">
                    Mulai Gratis
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(180,120,30,0.18),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '44px 44px' }}
        />
        <div className="absolute top-1/4 left-[8%] w-80 h-80 bg-amber-600/15 rounded-full blur-[120px] float-anim" />
        <div className="absolute bottom-1/3 right-[8%] w-80 h-80 bg-yellow-600/15 rounded-full blur-[120px] float-anim-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/[0.06] border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            React · TypeScript · Tailwind · Zustand · Framer Motion
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Boilerplate SaaS
            </span>
            <br />
            <span className="text-gold-gradient">
              Modern & Siap Pakai
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Template aplikasi web lengkap dengan <strong className="text-white font-semibold">autentikasi, manajemen langganan, admin panel, CMS artikel</strong>, dan sistem tiket support — siap dikustomisasi untuk produk Anda.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          >
            <Link
              to={isAuthenticated ? '/app' : '/login'}
              className="group w-full sm:w-auto bg-gold-gradient text-black font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,166,58,0.3)] text-base"
            >
              {isAuthenticated ? 'Buka Dashboard' : 'Mulai Gratis — Tanpa Kartu Kredit'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#cara-kerja"
              className="w-full sm:w-auto bg-white/[0.06] border border-white/[0.12] text-white font-semibold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/[0.1] hover:border-white/20 transition-all text-base"
            >
              <Eye className="w-4 h-4" /> Lihat Fitur
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-slate-600 mb-8"
          >
            Tidak perlu kartu kredit · Setup dalam 2 menit · Gratis selamanya untuk akun Starter
          </motion.p>
        </div>

        {/* Hero App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20"
        >
          <div className="relative rounded-2xl border border-amber-500/20 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_80px_rgba(180,120,30,0.08)] bg-[#080808]">
            {/* Fake titlebar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/[0.07]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-slate-600 ml-2 font-mono">yourapp.id/app</span>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                LIVE
              </div>
            </div>
            {/* Mock dashboard UI */}
            <div className="grid grid-cols-12 min-h-[420px] text-xs font-mono">
              {/* Sidebar */}
              <div className="col-span-2 bg-[#0a0a0a] border-r border-white/[0.06] p-3 hidden md:block">
                <div className="text-slate-600 text-[10px] font-bold uppercase mb-3 tracking-wider">Menu</div>
                {['Overview', 'Analytics', 'Users', 'Billing', 'Settings'].map((s, i) => (
                  <div key={s} className={`py-1.5 px-2 rounded text-[10px] mb-0.5 ${i === 0 ? 'bg-amber-500/10 text-white border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                    {s}
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div className="col-span-12 md:col-span-7 p-5 relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white font-bold text-sm">Overview</span>
                  <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded">+12%</span>
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l: 'Users', v: '1,248', c: 'text-blue-400' },
                    { l: 'Revenue', v: 'Rp 4.2M', c: 'text-amber-400' },
                    { l: 'Active', v: '342', c: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.l} className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-3">
                      <div className="text-[9px] text-slate-600 mb-1">{s.l}</div>
                      <div className={`text-sm font-bold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div className="flex items-end gap-[3px] h-36 px-2 mb-3">
                  {[60,45,70,55,80,65,90,75,85,95,72,88,65,78,92,68,82,95,74,86,96,70,83,97,75,89,68,82,93,77,85,91,88,94,79,96,84,90,87,92].map((h, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-[1px]">
                      <div className="w-[1px] bg-slate-700" style={{ height: `${Math.abs(Math.sin(i)) * 10 + 3}%` }} />
                      <div
                        className={`w-full rounded-[1px] ${i % 3 !== 1 ? 'bg-amber-500/70' : 'bg-amber-900/50'}`}
                        style={{ height: `${h * 0.45 + 8}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-[9px] text-slate-600">
                  <span>Jan <span className="text-amber-400">2.4M</span></span>
                  <span>Feb <span className="text-amber-400">3.1M</span></span>
                  <span>Mar <span className="text-emerald-400">4.2M ▲</span></span>
                </div>
              </div>
              {/* Right panel */}
              <div className="col-span-3 bg-[#0a0a0a] border-l border-white/[0.06] p-4 hidden md:flex flex-col">
                <div className="text-slate-600 text-[10px] font-bold uppercase mb-3 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Recent Activity
                </div>
                {[
                  { user: 'Arif S.', action: 'Upgraded to Pro', time: '2m ago', dot: 'bg-amber-400' },
                  { user: 'Bima R.', action: 'Opened ticket', time: '5m ago', dot: 'bg-blue-400' },
                  { user: 'Citra N.', action: 'New signup', time: '8m ago', dot: 'bg-emerald-400' },
                  { user: 'Dimas K.', action: 'Upgraded to Pro', time: '12m ago', dot: 'bg-amber-400' },
                  { user: 'Eka P.', action: 'Password changed', time: '15m ago', dot: 'bg-purple-400' },
                ].map((r, i) => (
                  <div key={i} className="mb-3 flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${r.dot} mt-1 shrink-0`} />
                    <div>
                      <div className="text-[10px] text-slate-300 font-bold">{r.user}</div>
                      <div className="text-[9px] text-slate-600">{r.action}</div>
                      <div className="text-[8px] text-slate-700">{r.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-amber-500/15 blur-[60px] rounded-full" />
        </motion.div>
      </section>

      {/* ── FEATURE MARQUEE ── */}
      <FeatureMarquee />

      {/* ── TECH STACK ── */}
      <section className="py-16 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-slate-600 mb-10">Tech Stack yang Sudah Terintegrasi</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React + TypeScript', color: 'text-blue-400', bg: 'bg-blue-400/8 border-blue-400/20', symbol: '⚛' },
              { name: 'Tailwind CSS',       color: 'text-cyan-400',  bg: 'bg-cyan-400/8 border-cyan-400/20',  symbol: '🎨' },
              { name: 'Zustand + Router',   color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/20', symbol: '⚡' },
              { name: 'Framer Motion',      color: 'text-purple-400', bg: 'bg-purple-400/8 border-purple-400/20', symbol: '✨' },
            ].map((ex) => (
              <div key={ex.name} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${ex.bg} group hover:scale-105 transition-transform duration-300`}>
                <div className="text-3xl">{ex.symbol}</div>
                <span className={`text-sm font-bold ${ex.color} text-center`}>{ex.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatCounter value={10} suffix="+" label="Halaman siap pakai" />
          <StatCounter value={5} label="Pattern komponen utama" />
          <StatCounter value={20} suffix="+" label="Custom hooks & utilities" />
          <StatCounter value={100} suffix="%" label="TypeScript typed" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" className="py-28 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 mb-4"
          >
            <Zap className="w-3.5 h-3.5" /> Fitur Boilerplate
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            Semua yang Anda Butuhkan<br />
            <span className="text-slate-500">Sudah Ada di Sini</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed"
          >
            Dari autentikasi hingga manajemen langganan — semua infrastruktur sudah siap sehingga Anda bisa fokus membangun fitur produk utama.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <Lock className="w-5 h-5 text-blue-400" />, title: 'Auth & Session Guard', desc: 'Login, register, JWT access + refresh token, sesi berbasis sessionStorage, dan auto-redirect saat token kedaluwarsa. Zustand dengan middleware persist.', delay: 0 },
            { icon: <Users className="w-5 h-5 text-amber-400" />, title: 'Role Management', desc: 'Sistem role user/admin dengan AdminRoute dan ProtectedRoute yang siap dipakai. Akses halaman admin otomatis terlindungi dari user biasa.', delay: 0.08 },
            { icon: <BarChart2 className="w-5 h-5 text-emerald-400" />, title: 'Admin Dashboard', desc: 'Panel admin lengkap dengan manajemen user, histori transaksi, tiket support, dan CMS artikel — semuanya dalam satu tampilan sidebar yang rapi.', delay: 0.16 },
            { icon: <Database className="w-5 h-5 text-orange-400" />, title: 'CMS Artikel', desc: 'Kelola artikel dan konten statis langsung dari admin panel. Mendukung publish/draft, kategori, excerpt, cover image, dan slug otomatis.', delay: 0.24 },
            { icon: <Globe className="w-5 h-5 text-pink-400" />, title: 'Support Tickets', desc: 'Sistem tiket support dua arah antara user dan admin. User bisa buat tiket, admin bisa balas dan ubah status. Riwayat percakapan lengkap.', delay: 0.32 },
            { icon: <Activity className="w-5 h-5 text-yellow-400" />, title: 'Payment & Subscription', desc: 'Integrasi pembayaran siap pakai dengan ProGate untuk membatasi akses fitur berdasarkan tier langganan. Riwayat pembayaran ditampilkan di profil.', delay: 0.40 },
          ].map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="cara-kerja" className="py-28 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 mb-4">
              <Clock className="w-3.5 h-3.5" /> Cara Kerja
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Clone, Kustomisasi,<br />
              <span className="text-slate-500">Langsung Deploy</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
              Boilerplate ini dirancang agar Anda bisa fokus membangun fitur produk, bukan infrastruktur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(33%-2rem)] right-[calc(33%-2rem)] h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            {[
              { n: '01', title: 'Clone & Install', desc: 'Clone repository, jalankan npm install, atur file .env dengan URL backend Anda. Semua dependency sudah dikonfigurasi — tidak perlu setup dari nol.', icon: <Layers className="w-7 h-7 text-amber-400" /> },
              { n: '02', title: 'Ganti Branding', desc: 'Update nama aplikasi, logo, warna primary di CSS variables, dan teks konten. Design system berbasis Tailwind + CSS custom properties membuatnya mudah.', icon: <Globe className="w-7 h-7 text-yellow-400" /> },
              { n: '03', title: 'Tambah Fitur', desc: 'Tambahkan route, komponen, dan hooks baru mengikuti pola yang sudah ada. Semua file sudah distrukturisasi dengan konvensi yang konsisten dan mudah diperluas.', icon: <TrendingUp className="w-7 h-7 text-emerald-400" /> },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18 }}
                className="relative text-center group"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center z-10">
                  <span className="text-[10px] font-black text-amber-400">{s.n}</span>
                </div>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.1] group-hover:border-amber-500/30 flex items-center justify-center mb-5 mt-2 transition-all duration-300 group-hover:bg-amber-500/5">
                  {s.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="harga" className="py-28 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 mb-4">
            <Star className="w-3.5 h-3.5" /> Pilihan Paket
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Mulai Gratis, Upgrade Kapan Saja<br />
            <span className="text-slate-500">Harga Transparan, Tanpa Biaya Tersembunyi</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <PricingCard
            plan="Starter"
            price="Gratis"
            priceNote="selamanya"
            cta="Mulai Sekarang"
            features={[
              'Akses dashboard dasar',
              'Profil & manajemen akun',
              'Baca artikel & konten',
              'Buat tiket support',
              'Update setiap 5 menit',
            ]}
          />
          <PricingCard
            plan="Pro"
            price="Rp 89K"
            badge="Paling Populer"
            cta="Berlangganan Pro"
            highlight
            features={[
              'Semua fitur Starter',
              'Akses semua fitur Pro',
              'Panel analitik lengkap',
              'Ekspor data',
              'Priority support',
              'API access',
              'Notifikasi real-time',
            ]}
          />
          <PricingCard
            plan="Enterprise"
            price="Custom"
            priceNote="hubungi tim kami"
            cta="Hubungi Kami"
            features={[
              'Semua fitur Pro',
              'White-label option',
              'Custom domain',
              'Dedicated account manager',
              'SLA uptime 99.9%',
              'Integrasi custom',
              'Laporan bulanan',
            ]}
          />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 mb-4">
              <Users className="w-3.5 h-3.5" /> Ulasan Pengguna
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Dipercaya Developer Indonesia</h2>
            <p className="text-slate-400 mt-4 text-sm max-w-lg mx-auto">Pengalaman nyata dari developer dan tim produk yang menggunakan boilerplate ini untuk membangun aplikasi mereka.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Rizky Aditya', role: 'Full Stack Developer', city: 'Jakarta', initials: 'RA', color: 'from-amber-600 to-yellow-500', text: 'Setup awal yang biasanya butuh 2–3 hari sekarang selesai dalam beberapa jam. Struktur kodenya bersih dan pola yang dipakai konsisten — mudah dipahami tim baru.' },
              { name: 'Fadhil Nugraha', role: 'Product Engineer', city: 'Bandung', initials: 'FN', color: 'from-emerald-600 to-teal-500', text: 'Auth flow, role management, dan subscription gate sudah siap pakai. Kami tinggal fokus ke fitur bisnis utama tanpa repot bangun infrastruktur dari nol.' },
              { name: 'Siti Maulida', role: 'Frontend Lead', city: 'Surabaya', initials: 'SM', color: 'from-pink-600 to-rose-500', text: 'Design system-nya solid. Dark theme, gold gradient, dan komponen yang ada terasa premium dan konsisten. Pelanggan kami langsung terpukau saat melihat UI-nya.' },
              { name: 'Bagas Pratama', role: 'Indie Developer', city: 'Yogyakarta', initials: 'BP', color: 'from-blue-600 to-indigo-500', text: 'Admin panel-nya fitur lengkap tapi tidak over-engineered. Manajemen user, tiket, artikel, dan transaksi — semua yang dibutuhkan MVP sudah ada.' },
              { name: 'Dinda Rahayu', role: 'Tech Co-Founder', city: 'Bali', initials: 'DR', color: 'from-violet-600 to-purple-500', text: 'Kami pakai ini sebagai basis tiga produk berbeda. Kustomisasi branding sangat mudah lewat CSS variables dan Tailwind config. Hemat waktu luar biasa.' },
              { name: 'Hendra Wijaya', role: 'CTO Startup', city: 'Medan', initials: 'HW', color: 'from-orange-600 to-amber-500', text: 'TypeScript-nya ketat, pola hook dan komponen konsisten, dan tidak ada dependensi yang tidak perlu. Kualitas kode yang bisa langsung masuk production.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-sm text-white shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role} · {t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(180,120,30,0.12),transparent)]" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[100px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3 h-3" /> Mulai Sekarang — Gratis
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Bangun Lebih Cepat,<br />
            <span className="text-gold-gradient">Ship Lebih Awal</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Fokus pada apa yang membuat produk Anda unik. Infrastruktur dasar sudah siap — mulai dengan akun Starter gratis selamanya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="group bg-gold-gradient text-black font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_0_40px_rgba(212,166,58,0.25)] text-base"
              >
                Buka Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group bg-gold-gradient text-black font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_0_40px_rgba(212,166,58,0.25)] text-base"
                >
                  Buat Akun Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white/[0.06] border border-white/[0.12] text-white font-semibold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/[0.1] transition-all text-base"
                >
                  <Shield className="w-4 h-4" /> Masuk ke Dashboard
                </Link>
              </>
            )}
          </div>

          <p className="text-xs text-slate-600">Tidak perlu kartu kredit · Setup 2 menit · Upgrade kapan saja</p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <Logo variant="horizontal" className="h-9 w-auto" />
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-xs">
                Boilerplate aplikasi SaaS modern dengan design system premium, autentikasi lengkap, dan admin panel siap pakai.
              </p>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Alamat perusahaan Anda,<br />
                    Kota, Provinsi, Kode Pos
                  </p>
                </div>
                <a href="mailto:hello@yourapp.id" className="flex items-center gap-2.5 group">
                  <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-slate-500 text-xs group-hover:text-amber-400 transition-colors">hello@yourapp.id</span>
                </a>
                <a href="tel:+6200000000000" className="flex items-center gap-2.5 group">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-slate-500 text-xs group-hover:text-amber-400 transition-colors">+62 000-0000-0000</span>
                </a>
              </div>

              <div className="flex gap-3">
                {[Twitter, Github, Send].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Produk', links: [
                { name: 'Fitur', url: '/#fitur' },
                { name: 'Cara Kerja', url: '/#cara-kerja' },
                { name: 'Harga', url: '/#harga' },
                { name: 'Roadmap', url: '/page/roadmap' }
              ]},
              { title: 'Support', links: [
                { name: 'Dokumentasi', url: '/page/dokumentasi' },
                { name: 'FAQ', url: '/page/faq' },
                { name: 'Status', url: '/page/status' },
                { name: 'Kontak CS', url: '/support' }
              ]},
              { title: 'Legal', links: [
                { name: 'Syarat & Ketentuan', url: '/page/terms' },
                { name: 'Kebijakan Privasi', url: '/page/privacy' },
                { name: 'Disclaimer', url: '/page/disclaimer' },
              ]},
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.name}>
                      {l.url.startsWith('/#') ? (
                        <a href={l.url} className="text-sm text-slate-400 hover:text-white transition-colors">{l.name}</a>
                      ) : (
                        <Link to={l.url} className="text-sm text-slate-400 hover:text-white transition-colors">{l.name}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} YourApp. Seluruh hak cipta dilindungi undang-undang.</p>
            <div className="flex gap-4">
              <Link to="/page/terms" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</Link>
              <Link to="/page/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</Link>
              <Link to="/page/disclaimer" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
