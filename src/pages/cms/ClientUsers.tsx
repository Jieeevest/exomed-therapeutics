import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Trash2, X, Search, Pencil, Check, UserCheck } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'sonner'
import { Pagination } from '@/components/cms/Pagination'
import { LimitSelector } from '@/components/cms/LimitSelector'
import { SortableHeader } from '@/components/cms/SortableHeader'

const TIER_SUGGESTIONS = [
  'Rumah Sakit', 'Klinik', 'Bisnis Kecil', 'Distributor', 'Personal', 'Apotek', 'Laboratorium',
]

interface ClientUser {
  id: string
  username: string
  email: string
  subscription_tier: string
  created_at: string
}

interface CreateForm {
  username: string
  email: string
  password: string
  subscription_tier: string
}

const EMPTY_FORM: CreateForm = { username: '', email: '', password: '', subscription_tier: '' }

export default function ClientUsers() {
  useSessionGuard()

  const [users, setUsers]     = useState<ClientUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)
  const [limit, setLimit]     = useState(5)
  const [sortBy, setSortBy]   = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<CreateForm>(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [formError, setFormError] = useState('')

  const [editingTier, setEditingTier]       = useState<string | null>(null)
  const [editingTierValue, setEditingTierValue] = useState('')
  const [savingTier, setSavingTier]         = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [search, limit, sortBy, sortDir])
  useEffect(() => { fetchUsers() }, [page, search, limit, sortBy, sortDir])

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort_by: sortBy, sort_dir: sortDir })
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
    setSaving(true)
    try {
      const res  = await fetchWithAuth('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { setFormError(data.message); return }
      setUsers(prev => [data.data, ...prev])
      setModal(false)
      setForm(EMPTY_FORM)
      toast.success('User berhasil ditambahkan')
    } catch {
      setFormError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const startEditTier = (id: string, current: string) => {
    setEditingTier(id)
    setEditingTierValue(current)
  }

  const saveTier = async (id: string) => {
    const trimmed = editingTierValue.trim()
    setEditingTier(null)
    if (!trimmed || trimmed === users.find(u => u.id === id)?.subscription_tier) return
    setSavingTier(id)
    try {
      const res  = await fetchWithAuth(`/api/users/${id}/tier`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: trimmed }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, subscription_tier: trimmed } : u))
        toast.success('Tier berhasil diperbarui')
      }
    } catch {}
    finally { setSavingTier(null) }
  }

  const handleDelete = (id: string, username: string) => {
    toast.warning(`Hapus akun "${username}"?`, {
      description: 'Tindakan ini tidak dapat dibatalkan.',
      action: { label: 'Hapus', onClick: async () => {
        try {
          const res  = await fetchWithAuth(`/api/users/${id}`, { method: 'DELETE' })
          const data = await res.json()
          if (data.success) {
            setUsers(prev => prev.filter(u => u.id !== id))
            toast.success('User berhasil dihapus')
          }
        } catch {}
      }},
      cancel: { label: 'Batal' },
    })
  }

  return (
    <CmsLayout
      title="Manajemen Klien"
      subtitle="Buat dan kelola akun pengguna portal"
      action={
        <button
          onClick={() => { setForm(EMPTY_FORM); setFormError(''); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      }
    >
      <div className="space-y-6">

        <div className="p-5 bg-card border border-border rounded-2xl inline-flex items-center gap-3">
          <div className="text-3xl font-black text-foreground">{loading ? '—' : total}</div>
          <div className="text-sm text-muted-foreground font-semibold">Total Klien Terdaftar</div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari username atau email..."
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/40"
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
              {search ? 'Tidak ada klien yang cocok.' : 'Belum ada klien terdaftar.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-border">
                <tr>
                  <SortableHeader label="Pengguna" field="username" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Tipe Klien</th>
                  <SortableHeader label="Bergabung" field="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
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
                      {editingTier === user.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            autoFocus
                            list="tier-suggestions"
                            value={editingTierValue}
                            onChange={e => setEditingTierValue(e.target.value)}
                            onBlur={() => saveTier(user.id)}
                            onKeyDown={e => { if (e.key === 'Enter') saveTier(user.id); if (e.key === 'Escape') setEditingTier(null) }}
                            className="w-36 px-2.5 py-1 text-xs border border-primary/40 rounded-lg outline-none bg-background text-foreground"
                          />
                          <button onClick={() => saveTier(user.id)} className="p-1 text-primary hover:bg-primary/10 rounded">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditTier(user.id, user.subscription_tier)}
                          disabled={savingTier === user.id}
                          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border bg-muted/40 text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-40"
                        >
                          {savingTier === user.id
                            ? <span className="w-3 h-3 border border-primary/40 border-t-primary rounded-full animate-spin" />
                            : null
                          }
                          {user.subscription_tier || <span className="text-muted-foreground/50 italic">Belum diset</span>}
                          <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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

        <datalist id="tier-suggestions">
          {TIER_SUGGESTIONS.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => { if (e.target === e.currentTarget) setModal(false) }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="font-black text-lg text-foreground">Tambah Klien Baru</h2>
                <button onClick={() => setModal(false)}>
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Username" required placeholder="cth. drSantoso" value={form.username} onChange={v => setForm(p => ({ ...p, username: v }))} />
                  <Field label="Email" required placeholder="cth. dr.santoso@klinik.co.id" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" />
                </div>
                <Field label="Password" required value={form.password} onChange={v => setForm(p => ({ ...p, password: v }))} type="password" placeholder="Min. 8 karakter" />
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Tipe Klien</label>
                  <input
                    list="tier-suggestions"
                    autoComplete="off"
                    value={form.subscription_tier}
                    onChange={e => setForm(p => ({ ...p, subscription_tier: e.target.value }))}
                    placeholder="cth. Rumah Sakit, Klinik..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>
                {formError && (
                  <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors text-foreground">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50">
                    <UserCheck className="w-4 h-4" />
                    {saving ? 'Menyimpan...' : 'Buat Akun'}
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
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30"
      />
    </div>
  )
}
