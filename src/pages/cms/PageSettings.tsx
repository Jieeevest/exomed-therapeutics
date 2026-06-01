import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'

interface PageData {
  hero_tagline: string
  hero_subtext: string
  about_text: string
  contact_wa: string
  contact_email: string
  address: string
}

const INITIAL: PageData = {
  hero_tagline: 'Terapi Exosome Generasi Terbaru untuk Profesional Medis',
  hero_subtext:  'Diproduksi di Amerika Serikat dengan standar FDA-regulated manufacturing. Didistribusikan secara eksklusif untuk dokter dan klinik profesional di Indonesia melalui Exomed Therapeutics Indonesia.',
  about_text:    'Exomed Therapeutics Indonesia adalah subsidiary resmi dari Exomed Therapeutics USA, perusahaan bioteknologi berbasis di Florida yang berfokus pada pengembangan produk exosome terstandarisasi untuk penggunaan medis profesional.',
  contact_wa:    '6281234567890',
  contact_email: 'info@exomed.id',
  address:       'Jakarta, Indonesia',
}

export default function PageSettings() {
  useSessionGuard()

  const [form, setForm] = useState<PageData>(INITIAL)
  const [saved, setSaved] = useState(false)

  const handleChange = (field: keyof PageData, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <CmsLayout
      title="Pengaturan Halaman"
      subtitle="Edit konten statis tanpa perlu deploy ulang"
      action={
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-black rounded-xl hover:opacity-90 transition-opacity"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Tersimpan' : 'Simpan Perubahan'}
        </button>
      }
    >
      <div className="max-w-2xl space-y-6">
        <Section title="Hero Section">
          <TextareaField label="Tagline Hero (H1)" value={form.hero_tagline} rows={2} onChange={v => handleChange('hero_tagline', v)} />
          <TextareaField label="Subtext Hero" value={form.hero_subtext} rows={4} onChange={v => handleChange('hero_subtext', v)} />
        </Section>

        <Section title="Tentang Exomed">
          <TextareaField label="Teks Tentang Perusahaan" value={form.about_text} rows={5} onChange={v => handleChange('about_text', v)} />
        </Section>

        <Section title="Kontak">
          <InputField label="Nomor WhatsApp (tanpa +)" value={form.contact_wa} onChange={v => handleChange('contact_wa', v)} placeholder="6281234567890" />
          <InputField label="Email" value={form.contact_email} onChange={v => handleChange('contact_email', v)} placeholder="info@exomed.id" />
          <InputField label="Alamat" value={form.address} onChange={v => handleChange('address', v)} placeholder="Jakarta, Indonesia" />
        </Section>
      </div>
    </CmsLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="font-black text-sm text-foreground border-b border-border pb-3">{title}</div>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-foreground placeholder:text-muted-foreground/30"
      />
    </div>
  )
}

function TextareaField({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows ?? 3}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-y transition-colors text-foreground"
      />
    </div>
  )
}
