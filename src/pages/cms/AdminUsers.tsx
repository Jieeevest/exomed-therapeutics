import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { ShieldCheck } from 'lucide-react'

export default function AdminUsers() {
  useSessionGuard()

  return (
    <CmsLayout
      title="Manajemen Admin"
      subtitle="Kelola akses pengguna CMS"
    >
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <div>
          <div className="font-black text-lg text-foreground mb-1">Manajemen admin CMS</div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Hubungi super admin untuk akses. Sistem autentikasi CMS menggunakan model terpisah yang dikelola langsung di level server.
          </p>
        </div>
      </div>
    </CmsLayout>
  )
}
