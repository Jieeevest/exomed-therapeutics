import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap, TrendingUp, Shield, Activity, BarChart2, ArrowRight,
  ChevronRight, Check, Star, Globe, Lock, Cpu,
  Twitter, Github, Send, Menu, X, Clock, Database, Eye
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
      className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

// ── Pricing Card ─────────────────────────────────────────────────────────
function PricingCard({ plan, price, features, highlight, badge }: {
  plan: string; price: string; features: string[]; highlight?: boolean; badge?: string
}) {
  const { isAuthenticated, accessToken } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (plan !== 'Pro') {
      navigate('/login')
      return
    }

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(API_URL + '/api/payment/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      
      if (data.success && data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl
      } else {
        alert('Gagal generate link pembayaran: ' + data.message)
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses pembayaran.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`relative rounded-2xl p-8 border ${highlight
      ? 'bg-white text-black border-white shadow-[0_0_80px_rgba(255,255,255,0.15)]'
      : 'bg-white/[0.03] border-white/[0.1] text-white'}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          {badge}
        </div>
      )}
      <p className={`text-sm font-bold tracking-widest uppercase mb-4 ${highlight ? 'text-black/60' : 'text-slate-400'}`}>{plan}</p>
      <div className="text-5xl font-black mb-1">{price}</div>
      <p className={`text-sm mb-8 ${highlight ? 'text-black/60' : 'text-slate-500'}`}>per bulan</p>
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? 'bg-black text-white' : 'bg-white/10'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={highlight ? 'text-black' : 'text-slate-300'}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group disabled:opacity-70 ${highlight
          ? 'bg-black text-white hover:bg-black/80'
          : 'bg-white/[0.07] border border-white/[0.15] text-white hover:bg-white/[0.12]'}`}
      >
        {isLoading ? 'Memproses...' : 'Mulai Sekarang'} 
        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  )
}

// ── Marquee Ticker ────────────────────────────────────────────────────────
const TICKERS = [
  { sym: 'BTC', pct: '+4.21', bull: true }, { sym: 'ETH', pct: '+2.87', bull: true },
  { sym: 'SOL', pct: '+7.54', bull: true }, { sym: 'BNB', pct: '-1.12', bull: false },
  { sym: 'ARB', pct: '+12.3', bull: true }, { sym: 'OP', pct: '+9.8', bull: true },
  { sym: 'AVAX', pct: '+3.4', bull: true }, { sym: 'INJ', pct: '-0.6', bull: false },
  { sym: 'SUI', pct: '+18.2', bull: true }, { sym: 'PEPE', pct: '+31.7', bull: true },
]

function TickerBar() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/[0.06] bg-black/40 py-3">
      <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap pr-8">
        {[...TICKERS, ...TICKERS].map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">{t.sym}/USDT</span>
            <span className={t.bull ? 'text-emerald-400' : 'text-red-400'}>{t.pct}%</span>
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
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'])

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/[0.05] transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">CryptoEx</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-sm text-slate-400 hover:text-white transition-colors">Fitur</a>
              <a href="#cara-kerja" className="text-sm text-slate-400 hover:text-white transition-colors">Cara Kerja</a>
              <a href="#harga" className="text-sm text-slate-400 hover:text-white transition-colors">Harga</a>
              <Link to="/articles" className="text-sm text-slate-400 hover:text-white transition-colors">Artikel & Berita</Link>
              <Link to="/support" className="text-sm text-slate-400 hover:text-white transition-colors">Support CS</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/app"
                  className="flex items-center gap-2 text-sm font-semibold bg-white text-black px-5 py-2 rounded-xl hover:bg-white/90 transition-all active:scale-95"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm font-semibold bg-white text-black px-5 py-2 rounded-xl hover:bg-white/90 transition-all active:scale-95"
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
              className="md:hidden border-t border-white/[0.06] bg-black/90 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Fitur</a>
                <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Cara Kerja</a>
                <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Harga</a>
                <Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Artikel & Berita</Link>
                <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 py-2">Support CS</Link>
                {isAuthenticated ? (
                  <Link to="/app" onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-white text-black text-sm font-bold py-3 rounded-xl mt-2">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-white text-black text-sm font-bold py-3 rounded-xl mt-2">
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

        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,255,0.25),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '44px 44px' }}
        />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-[10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Live — Binance · KuCoin · OKX · Crypto.com
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
              Trading Kripto
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Level Institusional
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Temukan koin berpotensi naik sebelum orang lain — dengan <strong className="text-white font-semibold">Bullish Scanner MTF</strong> yang menggabungkan sinyal classic & weighted dari 4 timeframe secara simultan.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={isAuthenticated ? "/app" : "/login"}
              className="group w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] text-base"
            >
              {isAuthenticated ? 'Buka Dashboard' : 'Mulai Gratis Sekarang'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#cara-kerja"
              className="w-full sm:w-auto bg-white/[0.06] border border-white/[0.12] text-white font-semibold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/[0.1] transition-all text-base"
            >
              <Eye className="w-4 h-4" /> Lihat Demo
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-slate-600 mt-5"
          >
            Tidak perlu kartu kredit · Setup dalam 30 detik
          </motion.p>
        </div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20"
        >
          <div className="relative rounded-2xl border border-white/[0.1] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-[#0a0a0a]">
            {/* Fake titlebar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/[0.07]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-slate-600 ml-2 font-mono">cryptoex.app/terminal</span>
            </div>
            {/* Mock terminal UI */}
            <div className="grid grid-cols-12 min-h-[340px] text-xs font-mono">
              {/* Sidebar */}
              <div className="col-span-2 bg-[#0c0c0c] border-r border-white/[0.06] p-3 hidden md:block">
                <div className="text-slate-600 text-[10px] font-bold uppercase mb-2 tracking-wider">Top Coins</div>
                {['BTCUSDT','ETHUSDT','SOLUSDT','ARBUSDT','OPUSDT','INJUSDT'].map((s, i) => (
                  <div key={s} className={`py-1.5 px-2 rounded text-[10px] mb-0.5 flex justify-between ${i === 0 ? 'bg-white/[0.07] text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                    <span>{s.replace('USDT', '')}</span>
                    <span className={i % 3 !== 1 ? 'text-emerald-400' : 'text-red-400'}>{i % 3 !== 1 ? '▲' : '▼'}</span>
                  </div>
                ))}
              </div>
              {/* Chart area */}
              <div className="col-span-12 md:col-span-7 p-4 relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white font-bold text-sm">BTC/USDT</span>
                  <span className="text-emerald-400 text-xs">+4.21%</span>
                  <span className="text-slate-500 text-xs">1H</span>
                </div>
                {/* Fake candlestick chart */}
                <div className="flex items-end gap-[3px] h-44 px-2">
                  {[60,45,70,55,80,65,90,75,85,95,72,88,65,78,92,68,82,95,74,86,96,70,83,97,75,89,68,82,93,77].map((h, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-[1px]">
                      <div className="w-[1px] bg-slate-600" style={{ height: `${Math.random() * 10 + 5}%` }} />
                      <div
                        className={`w-full rounded-[1px] ${i % 3 !== 1 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ height: `${h * 0.4 + 10}%`, opacity: 0.8 }}
                      />
                      <div className="w-[1px] bg-slate-600" style={{ height: `${Math.random() * 8 + 3}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Scanner panel */}
              <div className="col-span-3 bg-[#0c0c0c] border-l border-white/[0.06] p-3 hidden md:block">
                <div className="text-slate-600 text-[10px] font-bold uppercase mb-2 tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Bullish Scanner
                </div>
                {[
                  { sym: 'SUI', pct: '91.2', label: 'Bullish', col: 'text-emerald-400' },
                  { sym: 'SOL', pct: '84.7', label: 'Bullish', col: 'text-emerald-400' },
                  { sym: 'ARB', pct: '77.3', label: 'Mild ▲', col: 'text-emerald-300' },
                  { sym: 'ETH', pct: '72.1', label: 'Mild ▲', col: 'text-emerald-300' },
                  { sym: 'BTC', pct: '68.9', label: 'Mild ▲', col: 'text-emerald-300' },
                ].map((r, i) => (
                  <div key={i} className="mb-1.5">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-slate-300">{r.sym}</span>
                      <span className={r.col}>{r.pct}%</span>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-[3px]">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow under preview */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-violet-500/20 blur-[60px] rounded-full" />
        </motion.div>
      </section>

      {/* ── TICKER BAR ── */}
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <TickerBar />

      {/* ── STATS ── */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatCounter value={80} suffix="+" label="Koin Dianalisis Sekaligus" />
          <StatCounter value={4} label="Timeframe Simultan (15m–4H)" />
          <StatCounter value={98} suffix="%" label="Akurasi Signal Terverifikasi" />
          <StatCounter value={1200} suffix="+" label="Trader Aktif" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" className="py-28 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-violet-400 mb-4"
          >
            <Zap className="w-3 h-3" /> Fitur Utama
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            Semua yang Anda Butuhkan<br />
            <span className="text-slate-500">untuk Menang di Pasar</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Activity className="w-5 h-5 text-emerald-400" />, title: 'Bullish Scanner MTF', desc: 'Scan hingga 80 koin sekaligus menggunakan 4 timeframe (15m, 30m, 1h, 4h). Gabungan sinyal classic & weighted untuk akurasi maksimal.', delay: 0 },
            { icon: <BarChart2 className="w-5 h-5 text-blue-400" />, title: 'Chart Real-Time', desc: 'Tampilan candlestick profesional dengan indikator EMA, MACD, RSI, Bollinger Bands langsung dari sumber data exchange.', delay: 0.1 },
            { icon: <TrendingUp className="w-5 h-5 text-violet-400" />, title: 'Sinyal Kuantitatif', desc: 'Algoritma pembobotan PRICE(30%) + VOLUME(20%) + TECHNICAL(35%) + SENTIMENT(15%) yang telah diuji secara backtesting.', delay: 0.2 },
            { icon: <Globe className="w-5 h-5 text-cyan-400" />, title: 'Multi-Exchange', desc: 'Terhubung langsung ke Binance, KuCoin, OKX, dan Crypto.com — spot dan futures — tanpa perlu API key.', delay: 0.3 },
            { icon: <Cpu className="w-5 h-5 text-orange-400" />, title: 'Fear & Greed Index', desc: 'Integrasi sentiment pasar dari Fear & Greed Index dan Funding Rate real-time sebagai faktor tambahan dalam kalkulasi sinyal.', delay: 0.4 },
            { icon: <Database className="w-5 h-5 text-pink-400" />, title: 'Session Encrypted', desc: 'Sesi trading Anda terproteksi. Tidak ada data sensitif yang tersimpan di server pihak ketiga — semua kalkulasi lokal.', delay: 0.5 },
          ].map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="cara-kerja" className="py-28 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
              <Clock className="w-3 h-3" /> Cara Kerja
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Dari Data ke Keputusan<br />
              <span className="text-slate-500">dalam Hitungan Detik</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {[
              { n: '01', title: 'Pilih Exchange & Market', desc: 'Pilih Binance, KuCoin, OKX, atau Crypto.com — baik pasar spot maupun futures perpetual.', icon: <Globe className="w-6 h-6 text-blue-400" /> },
              { n: '02', title: 'Scanner Menganalisis', desc: 'CryptoEx menarik data 4 timeframe untuk setiap koin, menjalankan 20+ indikator teknikal, dan menghitung skor gabungan.', icon: <Cpu className="w-6 h-6 text-violet-400" /> },
              { n: '03', title: 'Ambil Keputusan', desc: 'Lihat ranking koin dari yang paling bullish. Klik untuk membuka chart lengkap dan analisis mendalam sebelum entry.', icon: <TrendingUp className="w-6 h-6 text-emerald-400" /> },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <div className="text-xs font-black text-slate-600 tracking-widest mb-2">{s.n}</div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="harga" className="py-28 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-400 mb-4">
            <Star className="w-3 h-3" /> Harga
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Investasi Paling Masuk Akal<br />
            <span className="text-slate-500">untuk Portofolio Kripto Anda</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <PricingCard
            plan="Starter"
            price="Gratis"
            features={['3 Exchange', 'Scanner 20 koin', 'Timeframe 1H saja', 'Chart dasar']}
          />
          <PricingCard
            plan="Pro"
            price="Rp 149K"
            badge="Paling Populer"
            highlight
            features={['Semua Exchange', 'Scanner 80 koin', 'MTF 4 timeframe', 'Sinyal Classic + Weighted', 'Fear & Greed live', 'Priority support']}
          />
          <PricingCard
            plan="Institutional"
            price="Custom"
            features={['Semua fitur Pro', 'API access', 'Custom alert webhook', 'White-label option', 'Dedicated support', 'SLA 99.9%']}
          />
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white">Dipercaya oleh Trader Indonesia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rizky A.', role: 'Day Trader · Jakarta', text: 'Scanner MTF ini luar biasa. Saya bisa filter koin yang layak dalam 2 menit. Sebelumnya butuh berjam-jam manual cek chart satu-satu.' },
              { name: 'Fadhil N.', role: 'Swing Trader · Bandung', text: 'Sinyal 4 timeframe sekaligus itu game-changer. Saya lebih percaya diri entry karena sudah ada konfirmasi dari TF kecil sampai besar.' },
              { name: 'Siti M.', role: 'Crypto Analyst · Surabaya', text: 'Platform yang bersih dan cepat. Tidak perlu banyak klik untuk dapatkan insight yang bisa langsung saya pakai.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(120,80,255,0.18),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 mb-8">
            <Lock className="w-3 h-3" /> Tanpa kartu kredit
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Mulai Trading<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Lebih Cerdas Hari Ini
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Bergabunglah dengan 1.200+ trader yang sudah menggunakan CryptoEx untuk menemukan peluang pasar lebih cepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="group bg-white text-black font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] text-base"
              >
                Buka Dashboard Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group bg-white text-black font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] text-base"
                >
                  Buat Akun Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white/[0.06] border border-white/[0.12] text-white font-semibold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/[0.1] transition-all text-base"
                >
                  <Shield className="w-4 h-4" /> Masuk ke Terminal
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg">CryptoEx</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Terminal trading kripto berbasis analisis kuantitatif multi-timeframe.
              </p>
              <div className="flex gap-3">
                {[Twitter, Github, Send].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Produk', links: [
                { name: 'Fitur', url: '/#fitur' }, 
                { name: 'Harga', url: '/#harga' }, 
                { name: 'Changelog', url: '/page/changelog' }, 
                { name: 'Roadmap', url: '/page/roadmap' }
              ]},
              { title: 'Support', links: [
                { name: 'Dokumentasi', url: '/page/dokumentasi' }, 
                { name: 'FAQ', url: '/page/faq' }, 
                { name: 'Status', url: '/page/status' }, 
                { name: 'Kontak', url: '/support' }
              ]},
              { title: 'Legal', links: [
                { name: 'Syarat & Ketentuan', url: '/page/terms' }, 
                { name: 'Kebijakan Privasi', url: '/page/privacy' }, 
                { name: 'Disclaimer', url: '/page/disclaimer' }
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
            <p className="text-xs text-slate-600">© 2025 CryptoEx. Hak cipta dilindungi.</p>
            <p className="text-xs text-slate-700">⚠️ Trading kripto mengandung risiko tinggi. Bukan saran keuangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
