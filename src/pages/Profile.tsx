import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Crown, Lock, Check, AlertCircle,
  CreditCard, Calendar, RefreshCw, Shield, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Tab = 'profile' | 'subscription'

export default function Profile() {
  const { user, accessToken, login, refreshToken } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('profile')

  // Profile form
  const [username, setUsername]     = useState(user?.username || '')
  const [email, setEmail]           = useState(user?.email || '')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [profileMsg, setProfileMsg]   = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [payHistory, setPayHistory]   = useState<any[]>([])
  const [subInfo, setSubInfo]         = useState<any>(null)
  const [loadingSub, setLoadingSub]   = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [loadingSubscribe, setLoadingSubscribe] = useState(false)

  const isPro = user?.subscription_tier === 'pro'

  useEffect(() => {
    if (tab === 'subscription') fetchSubData()
  }, [tab])

  const fetchSubData = async () => {
    setLoadingSub(true)
    try {
      const [subRes, histRes] = await Promise.all([
        fetch(API_URL + '/api/users/me/subscription', {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        fetch(API_URL + '/api/payment/history', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ])
      const subData  = await subRes.json()
      const histData = await histRes.json()
      if (subData.success)  setSubInfo(subData.data)
      if (histData.success) setPayHistory(histData.data)
    } catch {}
    finally { setLoadingSub(false) }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingProfile(true)
    setProfileMsg(null)
    try {
      const res = await fetch(API_URL + '/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ username, email })
      })
      const data = await res.json()
      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Profil berhasil diperbarui!' })
        // Update auth store
        login(accessToken!, refreshToken!, { ...user!, username: data.data.username, email: data.data.email })
      } else {
        setProfileMsg({ type: 'error', text: data.message })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Password baru tidak cocok.' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password minimal 8 karakter.' })
      return
    }
    setLoadingPassword(true)
    setPasswordMsg(null)
    try {
      const res = await fetch(API_URL + '/api/auth/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ oldPassword, newPassword })
      })
      const data = await res.json()
      if (data.success) {
        setPasswordMsg({ type: 'success', text: 'Password berhasil diubah!' })
        setOldPassword(''); setNewPassword(''); setConfirmPassword('')
      } else {
        setPasswordMsg({ type: 'error', text: data.message })
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleSubscribe = async () => {
    setLoadingSubscribe(true)
    try {
      const res = await fetch(API_URL + '/api/payment/subscribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (data.success && data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl
      } else {
        if (res.status === 401 || data.message.includes('Token tidak valid')) {
          alert('Sesi Anda telah kedaluwarsa. Silakan login kembali untuk melanjutkan.')
          useAuth.getState().logout()
          navigate('/login')
          return
        }
        alert('Gagal membuat link pembayaran: ' + (data.detail || data.message))
      }
    } catch {
      alert('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoadingSubscribe(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Terminal
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="font-bold text-white">Profil & Langganan</span>
          <div className="ml-auto">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPro ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              {isPro ? '⭐ PRO' : 'STARTER'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user?.username}</h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.04] border border-white/10 p-1 rounded-xl w-fit">
          {([
            { id: 'profile', label: 'Profil & Keamanan', icon: <User className="w-4 h-4" /> },
            { id: 'subscription', label: 'Langganan', icon: <Crown className="w-4 h-4" /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'profile' ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

              {/* Profile Form */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-bold mb-5 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Informasi Akun</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Username</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <AnimatePresence>
                    {profileMsg && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {profileMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {profileMsg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="submit" disabled={loadingProfile} className="px-5 py-2.5 bg-primary text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </form>
              </div>

              {/* Password Form */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-bold mb-5 flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Ubah Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: 'Password Lama', val: oldPassword, set: setOldPassword },
                    { label: 'Password Baru', val: newPassword, set: setNewPassword },
                    { label: 'Konfirmasi Password Baru', val: confirmPassword, set: setConfirmPassword },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-slate-400 block mb-1.5">{label}</label>
                      <input
                        type="password"
                        value={val}
                        onChange={e => set(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  ))}
                  <AnimatePresence>
                    {passwordMsg && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {passwordMsg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="submit" disabled={loadingPassword} className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/15 transition-colors disabled:opacity-50">
                    {loadingPassword ? 'Menyimpan...' : 'Ubah Password'}
                  </button>
                </form>
              </div>
            </motion.div>

          ) : (
            <motion.div key="subscription" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

              {/* Current Plan Card */}
              {isPro ? (
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="font-black text-white text-lg">Paket PRO</span>
                      </div>
                      <p className="text-slate-300 text-sm">Akses penuh ke semua fitur eksklusif CryptoEx</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">AKTIF</span>
                  </div>
                  {subInfo?.subscription_expires_at && (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Aktif hingga: <span className="text-white font-semibold">{new Date(subInfo.subscription_expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    {['Panel Sinyal AI', 'Backtest Strategi', 'Multi-Chart Grid', 'Bullish Scanner'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-slate-300"><Check className="w-3.5 h-3.5 text-emerald-400" />{f}</div>
                    ))}
                  </div>
                  <button onClick={handleSubscribe} disabled={loadingSubscribe} className="mt-5 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {loadingSubscribe ? 'Memproses...' : 'Perpanjang Sekarang'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Starter info */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-white">Paket Starter</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">Anda saat ini menggunakan paket gratis dengan akses terbatas.</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      {[
                        { f: 'Live Ticker & Harga', pro: false },
                        { f: 'Order Book & Trades', pro: false },
                        { f: 'Panel Sinyal AI', pro: true },
                        { f: 'Backtest Strategi', pro: true },
                        { f: 'Multi-Chart Grid', pro: true },
                        { f: 'Bullish Scanner', pro: true },
                      ].map(({ f, pro }) => (
                        <div key={f} className={`flex items-center gap-2 ${pro ? 'text-slate-600' : 'text-slate-400'}`}>
                          {pro ? <Lock className="w-3.5 h-3.5 text-yellow-600" /> : <Check className="w-3.5 h-3.5 text-emerald-500" />}
                          {f} {pro && <span className="text-[10px] text-yellow-600">PRO</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upgrade CTA */}
                  <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="font-black text-white">Upgrade ke PRO</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-5">Dapatkan akses penuh ke semua fitur analisis profesional.</p>
                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-black text-white">Rp 149K</span>
                      <span className="text-slate-400 text-sm pb-1">/bulan</span>
                    </div>
                    <button
                      onClick={handleSubscribe}
                      disabled={loadingSubscribe}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                    >
                      <Crown className="w-5 h-5" />
                      {loadingSubscribe ? 'Memproses...' : 'Upgrade Sekarang — Rp 149K/bln'}
                      {!loadingSubscribe && <ChevronRight className="w-4 h-4" />}
                    </button>
                    <p className="text-center text-xs text-slate-600 mt-3">Pembayaran aman via iPaymu • Transfer, QRIS, VA, dll.</p>
                  </div>
                </div>
              )}

              {/* Payment History */}
              {loadingSub ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : payHistory.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5">
                    <h3 className="font-bold text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Riwayat Pembayaran</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {payHistory.map(p => (
                      <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">CryptoEx PRO — 30 Hari</div>
                          <div className="text-xs text-slate-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">Rp {parseInt(p.amount).toLocaleString()}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'berhasil' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
