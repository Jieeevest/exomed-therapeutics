import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'id' | 'en' | 'zh' | 'ar'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLanguage = create<LangState>()(
  persist(
    (set) => ({
      lang: 'id',
      setLang: (lang) => {
        document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
        set({ lang })
      },
    }),
    { name: 'exomed-lang' },
  ),
)
