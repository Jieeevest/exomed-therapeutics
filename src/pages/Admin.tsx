import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CreditCard, Activity, ShieldAlert, ArrowLeft, Trash2, Shield, User as UserIcon } from 'lucide-react'
import { useAuth, User } from '@/store/useAuth'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Admin() {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users')
  
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/app')
    }
  }, [user])

  useEffect(() => {
    if (accessToken) {
      fetchData()
    }
  }, [accessToken, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const [statsRes, usersRes] = await Promise.all([
          fetch(API_URL + '/api/users/stats', { headers: { Authorization: `Bearer ${accessToken}` } }),
          fetch(API_URL + '/api/users', { headers: { Authorization: `Bearer ${accessToken}` } })
        ])
        const statsData = await statsRes.json()
        const usersData = await usersRes.json()
        if (statsData.success) setStats(statsData.data)
        if (usersData.success) setUsers(usersData.data)
      } else {
        const paymentsRes = await fetch(API_URL + '/api/payment/admin/all', { headers: { Authorization: `Bearer ${accessToken}` } })
        const paymentsData = await paymentsRes.json()
        if (paymentsData.success) setPayments(paymentsData.data)
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
      if (res.ok) fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/app')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Terminal
            </button>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-yellow-500" />
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-slate-400 text-sm mb-1 flex items-center gap-2"><Users className="w-4 h-4" /> Total Users</div>
              <div className="text-3xl font-bold">{stats.total_active}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-slate-400 text-sm mb-1 flex items-center gap-2"><Activity className="w-4 h-4" /> New (30d)</div>
              <div className="text-3xl font-bold text-emerald-400">+{stats.new_last_30d}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-slate-400 text-sm mb-1 flex items-center gap-2"><StarIcon className="w-4 h-4 text-yellow-400" /> Pro Users</div>
              <div className="text-3xl font-bold text-purple-400">{stats.total_pro}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-slate-400 text-sm mb-1 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Starter Users</div>
              <div className="text-3xl font-bold">{stats.total_starter}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'payments' ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Payment History
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{u.username}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        disabled={u.id === user.id}
                        className="bg-black border border-white/10 rounded px-2 py-1 text-xs outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.subscription_tier === 'pro' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {u.subscription_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(u.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user.id && (
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-300">{p.reference_id}</div>
                      <div className="text-[10px] text-slate-500">{p.trx_id || 'No iPaymu ID'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{p.username}</div>
                      <div className="text-xs text-slate-500">{p.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">Rp {parseInt(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        p.status === 'berhasil' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada transaksi.</div>}
          </div>
        )}

      </div>
    </div>
  )
}

function StarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}
