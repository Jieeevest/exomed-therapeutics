import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { CmsLayout } from '@/components/cms/CmsLayout'
import { useSessionGuard } from '@/hooks/useSessionGuard'

interface GeneralData {
  company_name: string
  meta_title: string
  meta_description: string
  ga_id: string
  wa_number: string
  wa_default_message: string
  logo_url: string
  favicon_url: string
}

const INITIAL: GeneralData = {
  company_name:       'Exomed Therapeutics Indonesia',
  meta_title:         'Exomed Therapeutics — Terapi Exosome untuk Profesional Medis di Indonesia',
  meta_description:   'Distributor eksklusif produk exosome terstandarisasi untuk dokter dan klinik profesional di Indonesia. FDA-Regulated Manufacturing.',
  ga_id:              '',
  wa_number:          '6281234567890',
  wa_default_message: 'Halo Exomed, saya ingin berkonsultasi mengenai produk exosome untuk klinik saya.',
  logo_url:           '/Logo Exomed BG Hitam.png',
  favicon_url:        '/favicon.png',
}

export default function GeneralSettings() {
  useSessionGuard()

  const [form, setForm] = useState<GeneralData>(INITIAL)
  const [saved, setSaved] = useState(false)

  const handleChange = (field: keyof GeneralData, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <CmsLayout
      title="Pengaturan Umum"
      subtitle="Konfigurasi nama perusahaan, SEO, dan integrasi"
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
      <div className="grid grid-cols-2 gap-6">
        <Section title="Identitas Perusahaan">
          <InputField label="Nama Perusahaan" value={form.company_name} onChange={v => handleChange('company_name', v)} />
          <InputField label="URL Logo" value={form.logo_url} onChange={v => handleChange('logo_url', v)} />
          <InputField label="URL Favicon" value={form.favicon_url} onChange={v => handleChange('favicon_url', v)} />
        </Section>

        <Section title="SEO (Meta Tags)">
          <InputField label="Meta Title" value={form.meta_title} onChange={v => handleChange('meta_title', v)} />
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Meta Description</label>
            <textarea
              value={form.meta_description}
              onChange={e => handleChange('meta_description', e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none transition-colors text-foreground"
            />
          </div>
          <InputField label="Google Analytics ID" value={form.ga_id} onChange={v => handleChange('ga_id', v)} placeholder="G-XXXXXXXXXX" />
        </Section>

        <Section title="Integrasi WhatsApp Business" className="col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <InputField label="Nomor WA (tanpa +)" value={form.wa_number} onChange={v => handleChange('wa_number', v)} placeholder="6281234567890" />
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Pesan Default WA</label>
                <textarea
                  value={form.wa_default_message}
                  onChange={e => handleChange('wa_default_message', e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none transition-colors text-foreground"
                />
              </div>
            </div>
            <div className="p-4 bg-muted/20 border border-border rounded-xl flex flex-col gap-2">
              <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">Preview Link WhatsApp</div>
              <div className="text-xs text-primary font-mono break-all leading-relaxed">
                {`https://wa.me/${form.wa_number}?text=${encodeURIComponent(form.wa_default_message)}`}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </CmsLayout>
  )
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 space-y-4 ${className ?? ''}`}>
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
