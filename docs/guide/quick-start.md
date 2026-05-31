# Quick Start

## Prasyarat

- Node.js 18+
- npm atau bun

## Instalasi

**1. Clone dan masuk ke folder**
```bash
git clone <repo-url>
cd boilerplate
```

**2. Install dependencies**
```bash
npm install
```

**3. Buat file environment**

Buat file `.env.local` di root project:
```env
VITE_API_URL=http://localhost:3001
```

> `VITE_API_URL` adalah base URL backend REST API Anda. Semua request dari `fetchWithAuth` dan form login/register akan diarahkan ke sini.

**4. Jalankan dev server**
```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Dev server di port 5173 |
| `npm run build` | Type check + build production |
| `npm run preview` | Preview build production |

::: tip
`npm run build` menjalankan TypeScript compiler sebelum Vite build. Ini berarti jika ada type error, build akan gagal. Gunakan ini sebagai pengganti test untuk type safety.
:::

## Menjalankan Docs (VitePress)

```bash
cd docs
npm install
npm run dev
# → http://localhost:5173 (atau port lain jika sudah terpakai)
```
