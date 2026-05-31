# Struktur Folder

```
boilerplate/
├── src/
│   ├── components/     # UI komponen reusable
│   ├── pages/          # Satu file per route
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand stores
│   ├── lib/            # Utility murni (tanpa React)
│   ├── constants/      # Konstanta & URL API
│   ├── types/          # TypeScript types global
│   ├── App.tsx         # Router utama
│   ├── main.tsx        # Entry point
│   └── index.css       # CSS variables & global styles
├── public/             # Aset statis (logo, favicon)
├── docs/               # Dokumentasi VitePress (ini)
├── .env.local          # Environment variables (tidak di-commit)
├── CLAUDE.md           # Panduan untuk Claude Code
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Path Alias

Semua import internal menggunakan alias `@/` yang menunjuk ke `src/`:

```ts
// ✅ Benar
import { Button } from '@/components/Button'
import { useAuth } from '@/store/useAuth'
import { cn } from '@/lib/utils'

// ❌ Hindari
import { Button } from '../../components/Button'
```

Alias dikonfigurasi di `vite.config.ts` dan `tsconfig.app.json`.

## `src/components/`

Berisi 20 UI komponen reusable. Semua komponen:
- Menggunakan dark theme yang konsisten
- Menggunakan `cn()` untuk class kondisional
- Menggunakan Framer Motion untuk animasi (jika relevan)

Lihat [UI Components](/components/button) untuk dokumentasi lengkap.

## `src/pages/`

Satu file per halaman/route. Konvensi penamaan: `NamaHalaman.tsx` dengan `export default function NamaHalaman()`.

Halaman yang butuh auth selalu memanggil `useSessionGuard()` di baris pertama.

## `src/store/`

Saat ini hanya ada `useAuth.ts`. Jika menambah store baru, ikuti pola yang sama: `create<State>()(persist(...))`.

## `src/lib/`

- `utils.ts` — `cn()`, `formatNumber()`, `formatPrice()`
- `api.ts` — `fetchWithAuth()` dengan auto token refresh

## `src/constants/apiUrls.ts`

Semua endpoint backend terpusat di sini:

```ts
import { API_URLS } from '@/constants/apiUrls'

const res = await fetchWithAuth(API_URLS.users.profile, { method: 'PUT', ... })
```

## `src/index.css`

Mendefinisikan:
- CSS custom properties untuk semua warna tema (format HSL)
- Utility class `.bg-gold-gradient` dan `.text-gold-gradient`
- Custom scrollbar global (4px, minimalis)
