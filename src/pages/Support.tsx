import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, Clock, CheckCircle2,
  XCircle, Send, ChevronRight, Ticket, RefreshCw
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CATEGORIES = [
  { value: 'general',   label: 'Umum' },
  { value: 'billing',   label: 'Pembayaran' },
  { value: 'technical', label: 'Teknis' },
  { value: 'feature',   label: 'Fitur' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open:        { label: 'Terbuka',       color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',     icon: Clock },
  in_progress: { label: 'Diproses',      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: RefreshCw },
  resolved:    { label: 'Terselesaikan', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  closed:      { label: 'Ditutup',       color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',   icon: XCircle },
}

export default function Support() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list')
  const [tickets, setTickets] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [replyMsg, setReplyMsg] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  // Create form
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')
  const [creating, setCreating] = useState(false)

  const headers = { Authorization: `Bearer ${accessToken}` }

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/tickets`, { headers })
      const data = await res.json()
      if (data.success) setTickets(data.data)
    } catch {} finally { setLoading(false) }
  }

  const fetchTicket = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, { headers })
      const data = await res.json()
      if (data.success) { setSelected(data.data); setView('detail') }
    } catch {}
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, message })
      })
      const data = await res.json()
      if (data.success) {
        await fetchTickets()
        setSubject(''); setCategory('general'); setMessage('')
        setView('list')
      }
    } catch {} finally { setCreating(false) }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMsg.trim() || !selected) return
    setSendingReply(true)
    try {
      const res = await fetch(`${API_URL}/api/tickets/${selected.id}/reply`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMsg })
      })
      const data = await res.json()
      if (data.success) {
        setReplyMsg('')
        await fetchTicket(selected.id)
      }
    } catch {} finally { setSendingReply(false) }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => view !== 'list' ? setView('list') : navigate('/app')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            {view !== 'list' ? 'Kembali' : 'Terminal'}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="font-bold flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" /> Customer Support
          </span>
          {view === 'list' && (
            <button onClick={() => setView('create')}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4" /> Buat Tiket
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* LIST */}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-2xl font-black mb-2">Tiket Saya</h1>
              <p className="text-slate-400 text-sm mb-6">Lacak status laporan dan percakapan Anda dengan tim kami.</p>

              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
              ) : tickets.length === 0 ? (
                <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                  <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">Belum ada tiket. Buat tiket baru jika ada kendala.</p>
                  <button onClick={() => setView('create')} className="mt-4 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
                    Buat Tiket Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map(t => {
                    const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.open
                    const Icon = cfg.icon
                    return (
                      <motion.button key={t.id} whileHover={{ x: 4 }} onClick={() => fetchTicket(t.id)}
                        className="w-full text-left bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-5 flex items-center gap-4 transition-colors">
                        <div className={`p-2.5 rounded-xl border ${cfg.color}`}><Icon className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{t.subject}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {CATEGORIES.find(c => c.value === t.category)?.label} · {parseInt(t.reply_count)} balasan · {new Date(t.updated_at).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* CREATE */}
          {view === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-2xl font-black mb-2">Buat Tiket Baru</h1>
              <p className="text-slate-400 text-sm mb-6">Deskripsikan kendala Anda dan tim kami akan segera merespons.</p>
              <form onSubmit={handleCreate} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Subjek</label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Deskripsikan masalah Anda secara singkat..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Kategori</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Pesan</label>
                  <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Jelaskan kendala Anda secara detail..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setView('list')}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">Batal</button>
                  <button type="submit" disabled={creating}
                    className="px-5 py-2.5 bg-primary text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-4 h-4" />{creating ? 'Mengirim...' : 'Kirim Tiket'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* DETAIL */}
          {view === 'detail' && selected && (
            <motion.div key="detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-xl font-black">{selected.subject}</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {CATEGORIES.find(c => c.value === selected.category)?.label} · Dibuat {new Date(selected.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                {(() => { const cfg = STATUS_CONFIG[selected.status]; const Icon = cfg?.icon; return (
                  <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full border flex items-center gap-1 ${cfg?.color}`}>
                    {Icon && <Icon className="w-3 h-3" />} {cfg?.label}
                  </span>
                )})()}
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-6">
                {(selected.replies || []).map((r: any) => (
                  <div key={r.id} className={`flex gap-3 ${r.is_admin ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${r.is_admin ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                      {r.is_admin ? 'CS' : r.username[0].toUpperCase()}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${r.is_admin ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-xs font-semibold mb-1 ${r.is_admin ? 'text-primary' : 'text-slate-400'}`}>
                        {r.is_admin ? '⭐ Support Team' : r.username}
                      </div>
                      <p className="text-white/90 whitespace-pre-wrap">{r.message}</p>
                      <div className="text-[10px] text-slate-600 mt-1.5">{new Date(r.created_at).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              {selected.status !== 'closed' && (
                <form onSubmit={handleReply} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex gap-3">
                  <textarea rows={2} value={replyMsg} onChange={e => setReplyMsg(e.target.value)} placeholder="Tulis balasan..."
                    className="flex-1 bg-transparent text-sm focus:outline-none resize-none placeholder:text-slate-600" />
                  <button type="submit" disabled={sendingReply || !replyMsg.trim()}
                    className="self-end px-4 py-2 bg-primary text-black font-bold rounded-xl text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2 transition-opacity">
                    <Send className="w-4 h-4" />{sendingReply ? '...' : 'Kirim'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
