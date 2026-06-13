import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Microscope, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { API_BASE } from '@/constants/apiUrls'

const API_URL = API_BASE

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const login = useAuth((state) => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!data.success) {
        setErrorMsg(data.message || 'Email atau password salah')
        return
      }

      login(data.data.accessToken, data.data.refreshToken, data.data.user)
      navigate('/cms', { replace: true })
    } catch {
      setErrorMsg('Tidak dapat terhubung ke server. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] flex text-gray-900 dark:text-white overflow-hidden selection:bg-primary/30">

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden border-r border-black/[0.06] dark:border-white/5 bg-gray-50 dark:bg-transparent">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/20 dark:via-black dark:to-[#030303] z-0" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[150px] pointer-events-none"
          animate={{ x: mousePos.x * 0.1 - 300, y: mousePos.y * 0.1 - 300 }}
          transition={{ type: 'spring', damping: 50, stiffness: 50 }}
        />
        <div className="relative z-10 p-12 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl font-light text-gray-500 dark:text-muted-foreground leading-tight mb-8"
          >
            Portal eksklusif untuk <br />
            <span className="text-gray-900 dark:text-white font-semibold">dokter dan klinik profesional</span> di Indonesia.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col gap-3 mt-12"
          >
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-primary" />, label: 'FDA-Regulated Manufacturing' },
              { icon: <Microscope className="w-5 h-5 text-primary" />, label: 'Standardized Exosome Products' },
              { icon: <Award className="w-5 h-5 text-primary" />, label: 'For Licensed Medical Professionals' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/[0.04] dark:bg-white/5 border border-black/[0.07] dark:border-white/10 px-4 py-3 rounded-2xl">
                {f.icon}
                <span className="text-sm font-semibold text-gray-700 dark:text-white/80">{f.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4 lg:p-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] lg:hidden pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-white dark:bg-black/60 backdrop-blur-2xl border border-black/[0.08] dark:border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">

            <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Admin Login
              </h2>
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                Masuk ke portal manajemen Exomed Therapeutics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3 overflow-hidden"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-gray-400 dark:text-muted-foreground ml-1">EMAIL</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 dark:text-muted-foreground group-focus-within/input:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-black/[0.08] dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-[#111] focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:placeholder:text-white/20"
                    placeholder="dokter@klinik.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-gray-400 dark:text-muted-foreground ml-1">PASSWORD</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 dark:text-muted-foreground group-focus-within/input:text-primary transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-black/[0.08] dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-[#111] focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-gold-gradient text-white font-bold rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group/btn"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs font-medium text-gray-400 dark:text-muted-foreground/60 tracking-widest uppercase relative z-10">
              <CheckCircle className="h-3 w-3" />
              <span>Akses Khusus Tenaga Medis Berlisensi</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
