import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Activity, ShieldAlert, ArrowLeft, Trash2, User as UserIcon,
  CreditCard, Ticket, BookOpen, ChevronRight
} from 'lucide-react'
import { useAuth, User } from '@/store/useAuth'
import { useSessionGuard } from '@/hooks/useSessionGuard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

type Tab = 'users' | 'payments' | 'tickets' | 'articles'

export default function Admin() {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()
  useSessionGuard()
  const [activeTab, setActiveTab] = useState<Tab>('users')

  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [articleForm, setArticleForm] = useState<any>(null)
  const [ticketDetail, setTicketDetail] = useState<any>(null)
  const [replyMsg, setReplyMsg] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') navigate('/app')
  }, [user, navigate])

  useEffect(() => {
    if (accessToken) fetchData()
  }, [accessToken, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const [statsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/api/users/stats`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${accessToken}` } })
        ])
        const statsData = await statsRes.json()
        const usersData = await usersRes.json()
        if (statsData.success) setStats(statsData.data)
        if (usersData.success) setUsers(usersData.data)
      } else if (activeTab === 'payments') {
        const res = await fetch(`${API_URL}/api/payment/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
        const data = await res.json()
        if (data.success) setPayments(data.data)
      } else if (activeTab === 'tickets') {
        const res = await fetch(`${API_URL}/api/tickets/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
        const data = await res.json()
        if (data.success) setTickets(data.data)
      } else if (activeTab === 'articles') {
        const res = await fetch(`${API_URL}/api/articles/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
        const data = await res.json()
        if (data.success) setArticles(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ role: newRole })
      })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  // --- Article CRUD ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = articleForm.id ? 'PUT' : 'POST'
    const url = articleForm.id ? `${API_URL}/api/articles/${articleForm.id}` : `${API_URL}/api/articles`
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(articleForm)
      })
      const data = await res.json()
      if (data.success) {
        setArticleForm(null)
        fetchData()
      } else {
        alert(data.message)
      }
    } catch (err) { console.error(err) }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    try {
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  // --- Ticket Actions ---
  const fetchTicketDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      const data = await res.json()
      if (data.success) setTicketDetail(data.data)
    } catch (err) { console.error(err) }
  }

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMsg.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/tickets/${ticketDetail.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ message: replyMsg })
      })
      const data = await res.json()
      if (data.success) {
        setReplyMsg('')
        fetchTicketDetail(ticketDetail.id)
        fetchData() // refresh list to update reply count & status
      }
    } catch (err) { console.error(err) }
  }

  const handleUpdateTicketStatus = async (status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${ticketDetail.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        fetchTicketDetail(ticketDetail.id)
        fetchData()
      }
    } catch (err) { console.error(err) }
  }

  const NAV_ITEMS = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'payments', label: 'Transactions', icon: CreditCard },
    { id: 'tickets', label: 'Support Tickets', icon: Ticket },
    { id: 'articles', label: 'Content & Articles', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="font-black tracking-tight text-xl">Admin<span className="text-primary">Panel</span></span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-8">Superuser Mode</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu Utama</div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button 
            onClick={() => navigate('/app')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/[0.03] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Kembali ke App
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Kelola data dan konfigurasi sistem secara real-time.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/5 rounded-full pl-2 pr-4 py-1.5 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-bold text-white leading-tight">{user?.username}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Administrator</div>
              </div>
            </div>
          </header>

          {/* User Stats (Only show on users tab) */}
          {activeTab === 'users' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                </div>
                <div className="text-4xl font-black">{stats.total_active}</div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] -z-10 group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Active Pro</span>
                </div>
                <div className="text-4xl font-black">{stats.total_pro}</div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Starter</span>
                </div>
                <div className="text-4xl font-black">{stats.total_starter}</div>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl relative">
            
            {loading && (
              <div className="absolute inset-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}

            <div className="overflow-x-auto">
              {activeTab === 'users' && (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pengguna</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Peran</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Paket</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Bergabung</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{u.username}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            disabled={u.id === user?.id}
                            className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary transition-colors cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${u.subscription_tier === 'pro' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                            {u.subscription_tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(u.created_at || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.id !== user?.id && (
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus User">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'payments' && (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID Transaksi</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pengguna</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nominal</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-slate-300 bg-white/5 inline-block px-2 py-1 rounded">{p.reference_id}</div>
                          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{p.trx_id || 'MENUNGGU iPaymu'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{p.username}</div>
                          <div className="text-xs text-slate-500">{p.email}</div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold">
                          Rp {parseInt(p.amount).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            p.status === 'berhasil' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(p.created_at).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Belum ada transaksi pembayaran.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'tickets' && (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Subjek & Kategori</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pelapor</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Balasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tickets.map(t => (
                      <tr key={t.id} onClick={() => fetchTicketDetail(t.id)} className="hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white truncate max-w-xs" title={t.subject}>{t.subject}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{t.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{t.username}</div>
                          <div className="text-xs text-slate-500">{t.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            t.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            t.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            t.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {t.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                              {t.reply_count}
                            </span>
                            <span className="text-[10px] text-slate-500">pesan</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tickets.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Belum ada tiket support yang masuk.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'articles' && (
                <div>
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold">Daftar Artikel</h3>
                    <button onClick={() => setArticleForm({ title: '', excerpt: '', content: '', category: 'news', is_published: false })} className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm hover:opacity-90 transition-opacity">
                      + Tulis Artikel Baru
                    </button>
                  </div>
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Judul & Slug</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {articles.map(a => (
                        <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white truncate max-w-sm" title={a.title}>{a.title}</div>
                            <div className="text-xs text-slate-500 truncate max-w-sm">/{a.slug}</div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{a.category}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {a.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setArticleForm(a)} className="p-2 text-slate-400 hover:text-white transition-colors">Edit</button>
                            <button onClick={() => handleDeleteArticle(a.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      {articles.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Belum ada artikel.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      
      {/* Ticket Detail Modal */}
      {ticketDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{ticketDetail.subject}</h2>
                <div className="text-sm text-slate-500 mt-1">
                  Dari: {ticketDetail.username} ({ticketDetail.email}) &bull; {new Date(ticketDetail.created_at).toLocaleString('id-ID')}
                </div>
              </div>
              <button onClick={() => setTicketDetail(null)} className="text-slate-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-400">Ubah Status:</span>
              <select 
                value={ticketDetail.status}
                onChange={(e) => handleUpdateTicketStatus(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {(ticketDetail.replies || []).map((r: any) => (
                <div key={r.id} className={`flex gap-3 ${r.is_admin ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${r.is_admin ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                    {r.is_admin ? 'CS' : r.username[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${r.is_admin ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
                    <div className={`text-xs font-semibold mb-1 ${r.is_admin ? 'text-primary' : 'text-slate-400'}`}>
                      {r.is_admin ? 'Anda (Admin)' : r.username}
                    </div>
                    <p className="text-white/90 whitespace-pre-wrap">{r.message}</p>
                    <div className="text-[10px] text-slate-600 mt-1.5">{new Date(r.created_at).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              ))}
            </div>

            {ticketDetail.status !== 'closed' && (
              <form onSubmit={handleReplyTicket} className="p-4 border-t border-white/5 bg-white/[0.02] flex gap-3">
                <textarea 
                  rows={2} required
                  value={replyMsg} onChange={e => setReplyMsg(e.target.value)}
                  placeholder="Tulis balasan untuk user..."
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                />
                <button type="submit" className="self-end px-5 py-2.5 bg-primary text-black font-bold rounded-xl text-sm hover:opacity-90">Balas</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Article Form Modal */}
      {articleForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold">{articleForm.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
              <button onClick={() => setArticleForm(null)} className="text-slate-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Judul Artikel</label>
                <input required value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Kategori</label>
                  <select value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                    <option value="news">Berita</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="analysis">Analisis</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">URL Cover Image (Opsional)</label>
                  <input value={articleForm.cover_url || ''} onChange={e => setArticleForm({...articleForm, cover_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Kutipan Pendek (Excerpt)</label>
                <textarea rows={2} value={articleForm.excerpt || ''} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Isi Konten (Dukung Markdown / Plain Text)</label>
                <textarea required rows={10} value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-y font-mono" />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={articleForm.is_published} onChange={e => setArticleForm({...articleForm, is_published: e.target.checked})} className="rounded bg-black border-white/10 text-primary focus:ring-primary/20" />
                  Langsung Publish (Tampil di Publik)
                </label>
                <div className="flex-1" />
                <button type="button" onClick={() => setArticleForm(null)} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:opacity-90">Simpan Artikel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
