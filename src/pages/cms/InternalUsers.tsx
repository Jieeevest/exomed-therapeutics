import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Trash2, X, Search, UserCog } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'

interface InternalUser {
  id: string
  username: string
  email: string
  role: string
  created_at: string
}

interface CreateForm {
  username: string
  email: string
  password: string
  role: 'admin' | 'superadmin'
}

const EMPTY_FORM: CreateForm = { username: '', email: '', password: '', role: 'admin' }

const ROLE_BADGE: Record<string, string> = {
  superadmin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  admin:      'bg-primary/10 text-primary border-primary/20',
}

export default function InternalUsers() {
  useSessionGuard()

  const [users, setUsers]     = useState<InternalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)
  const [limit, setLimit]     = useState(5)
  const [sortBy, setSortBy]   = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState<CreateForm>(EMPTY_FORM)
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  const closeModal = () => { setModal(false); setForm(EMPTY_FORM); setConfirmPw(''); setFormError('') }

  useEffect(() => { setPage(1) }, [search, limit, sortBy, sortDir])
  useEffect(() => { fetchUsers() }, [page, search, limit, sortBy, sortDir])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir, role: 'admin' })
      if (search) params.set('search', search)
      const res  = await fetchWithAuth(`/api/users?${params}`)
      const data = await res.json()
      if (data.success) { setUsers(data.data); setTotal(data.total ?? data.data.length) }
    } catch {}
    finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (form.password !== confirmPw) { setFormError('Konfirmasi password tidak cocok.'); return }
    setSaving(true)
    try {
      const res  = await fetchWithAuth('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'admin' }),
      })
      const data = await res.json()
      if (!data.success) { setFormError(data.message); return }
      setUsers(prev => [data.data, ...prev])
      setTotal(prev => prev + 1)
      closeModal()
    } catch {
      setFormError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Hapus akun user "${username}"? Tindakan ini tidak dapat dibatalkan.`)) return
    try {
      const res  = await fetchWithAuth(`/api/users/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) { setUsers(prev => prev.filter(u => u.id !== id)); setTotal(prev => prev - 1) }
    } catch {}
  }

  return (
    <CmsLayout
      title="Manajemen Admin"
      subtitle="Kelola akun internal yang dapat mengakses CMS"
      action={
        <button
          onClick={() => { setForm(EMPTY_FORM); setConfirmPw(''); setFormError(''); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      }
    >
      <div className="space-y-6">

        <div className="p-5 bg-card border border-border rounded-2xl inline-flex items-center gap-3">
          <div className="text-3xl font-black text-foreground">{loading ? '—' : total}</div>
          <div className="text-sm text-muted-foreground font-semibold">Total User Internal</div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari username atau email..."
                className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="ml-auto">
              <LimitSelector value={limit} onChange={v => { setLimit(v); setPage(1) }} />
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              {search ? 'Tidak ada user yang cocok.' : 'Belum ada user internal terdaftar.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-border">
                <tr>
                  <SortableHeader label="Pengguna" field="username" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Role</th>
                  <SortableHeader label="Tgl. Dibuat" field="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${ROLE_BADGE[user.role] ?? ROLE_BADGE.admin}`}>
                        {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-black text-lg text-foreground">Tambah User Internal</h2>
                <button onClick={closeModal}>
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <form onSubmit={handleCreate} autoComplete="off" className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Username" required placeholder="cth. admin_iqbal" value={form.username} onChange={v => setForm(p => ({ ...p, username: v }))} />
                  <Field label="Email" required placeholder="cth. iqbal@exomed.id" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Password" required value={form.password} onChange={v => setForm(p => ({ ...p, password: v }))} type="password" placeholder="Min. 8 karakter" />
                  <Field label="Konfirmasi Password" required value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Ulangi password" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Role<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex gap-2">
                    {(['admin', 'superadmin'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, role: r }))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-black border transition-all ${
                          form.role === r
                            ? r === 'superadmin'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-primary/10 text-primary border-primary/30'
                            : 'bg-muted/40 text-muted-foreground border-muted-foreground/20 hover:border-muted-foreground/40 hover:text-foreground'
                        }`}
                      >
                        {r === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </button>
                    ))}
                  </div>
                </div>
                {formError && (
                  <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors text-foreground">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50">
                    <UserCog className="w-4 h-4" />
                    {saving ? 'Menyimpan...' : 'Buat User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CmsLayout>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30"
      />
    </div>
  )
}
