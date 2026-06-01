import { useState } from 'react'
import { Plus, Trash2, X, ShieldCheck, Pencil, Shield } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { cn } from '@/lib/utils'
import type { AdminUser } from '@/types'

const DUMMY: AdminUser[] = [
  { id: '1', name: 'Annisa Dayumi',     email: 'annisa.dayumi@noxus.co.id', role: 'super-admin', created_at: '2026-01-01T00:00:00Z' },
  { id: '2', name: 'Budi Santoso',      email: 'budi@exomed.id',            role: 'editor',      created_at: '2026-03-15T00:00:00Z' },
  { id: '3', name: 'Dewi Lestari',      email: 'dewi@exomed.id',            role: 'viewer',      created_at: '2026-04-10T00:00:00Z' },
]

const ROLE_CONFIG: Record<AdminUser['role'], { label: string; color: string; icon: React.ElementType }> = {
  'super-admin': { label: 'Super Admin', color: 'bg-primary/10 text-primary border-primary/20',       icon: ShieldCheck },
  'editor':      { label: 'Editor',      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   icon: Pencil },
  'viewer':      { label: 'Viewer',      color: 'bg-slate-500/10 text-muted-foreground border-slate-500/20', icon: Shield },
}

interface InviteForm {
  name: string
  email: string
  role: AdminUser['role']
}

const EMPTY_INVITE: InviteForm = { name: '', email: '', role: 'editor' }

export default function AdminUsers() {
  useSessionGuard()

  const [users, setUsers] = useState<AdminUser[]>(DUMMY)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<InviteForm>(EMPTY_INVITE)
  const [editingRole, setEditingRole] = useState<string | null>(null)

  const handleInvite = () => {
    if (!form.name || !form.email) return
    setUsers(prev => [...prev, {
      id: String(Date.now()),
      name: form.name,
      email: form.email,
      role: form.role,
      created_at: new Date().toISOString(),
    }])
    setModal(false)
    setForm(EMPTY_INVITE)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus akses admin ini?')) return
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleRoleChange = (id: string, role: AdminUser['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    setEditingRole(null)
  }

  return (
    <CmsLayout
      title="Manajemen Admin"
      subtitle="Kelola akses pengguna CMS"
      action={
        <button
          onClick={() => { setForm(EMPTY_INVITE); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Undang Admin
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {(['super-admin', 'editor', 'viewer'] as AdminUser['role'][]).map(role => {
            const cfg = ROLE_CONFIG[role]
            const count = users.filter(u => u.role === role).length
            return (
              <div key={role} className={cn('p-4 border rounded-2xl bg-muted/20', cfg.color.includes('primary') ? 'border-primary/10' : cfg.color.includes('blue') ? 'border-blue-500/10' : 'border-slate-500/10')}>
                <cfg.icon className={cn('w-5 h-5 mb-2', cfg.color.split(' ')[1])} />
                <div className="font-black text-2xl">{count}</div>
                <div className="text-xs font-bold text-muted-foreground mt-0.5">{cfg.label}</div>
              </div>
            )
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                {['Pengguna', 'Email', 'Role', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => {
                const cfg = ROLE_CONFIG[user.role]
                const RoleIcon = cfg.icon
                return (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center font-black text-sm">
                          {user.name[0].toUpperCase()}
                        </div>
                        <span className="font-bold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-4">
                      {editingRole === user.id ? (
                        <select
                          defaultValue={user.role}
                          autoFocus
                          onBlur={() => setEditingRole(null)}
                          onChange={e => handleRoleChange(user.id, e.target.value as AdminUser['role'])}
                          className="bg-background border border-border rounded-lg px-2 py-1 text-xs outline-none focus:border-primary/40 text-foreground"
                        >
                          <option value="super-admin">Super Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingRole(user.id)}
                          className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase border transition-all hover:opacity-80', cfg.color)}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {cfg.label}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== 'super-admin' && (
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/20 border border-border rounded-2xl text-xs text-muted-foreground space-y-1">
          <div className="font-black text-muted-foreground mb-2">Deskripsi Role</div>
          <div><span className="font-bold text-primary">Super Admin</span> — Akses penuh ke semua menu CMS termasuk manajemen user.</div>
          <div><span className="font-bold text-blue-400">Editor</span> — Dapat mengelola konten (produk, artikel, studi kasus, dll.) tapi tidak dapat mengelola user atau pengaturan sistem.</div>
          <div><span className="font-bold text-muted-foreground">Viewer</span> — Hanya dapat melihat data. Tidak dapat membuat atau mengubah apapun.</div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-black text-lg">Undang Admin Baru</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nama Lengkap" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Field label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as AdminUser['role'] }))} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 text-foreground">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <p className="text-xs text-muted-foreground">Link undangan akan dikirim ke email admin baru saat backend tersedia.</p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(false)} className="px-5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold hover:bg-muted/40 transition-colors">Batal</button>
                <button onClick={handleInvite} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-opacity">Undang</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CmsLayout>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30" />
    </div>
  )
}
