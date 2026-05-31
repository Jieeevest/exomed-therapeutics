import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage, type Lang } from '@/store/useLanguage'
import { cn } from '@/lib/utils'

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'zh', label: '中文',      flag: '🇨🇳' },
  { code: 'ar', label: 'العربية',   flag: '🇸🇦' },
]

export function LanguageSelector({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGS.find(l => l.code === lang)

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{current?.flag} {current?.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-1 bg-card border border-border rounded-2xl py-1 shadow-xl z-50 min-w-[148px]">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]',
                lang === l.code ? 'text-primary' : 'text-foreground',
              )}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
