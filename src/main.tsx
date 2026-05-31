import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-ignore
import '@fontsource/space-grotesk'
import './index.css'
import App from './App'

// Initialize theme and language before React renders to prevent flash
;(() => {
  const themeRaw = localStorage.getItem('exomed-theme')
  const theme = themeRaw ? (JSON.parse(themeRaw)?.state?.theme as string) : 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')

  const langRaw = localStorage.getItem('exomed-lang')
  const lang = langRaw ? (JSON.parse(langRaw)?.state?.lang as string) : 'id'
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang || 'id'
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
