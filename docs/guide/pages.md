# Overview Halaman

## Landing (`/`)

Halaman publik marketing dengan semua section yang dibutuhkan SaaS:
- Navbar scroll-aware
- Hero dengan CTA dan app preview mock
- Feature marquee (scrolling)
- Tech stack / partner logos
- Stats counter dengan animasi
- Feature cards (6 fitur)
- How it works (3 langkah)
- Pricing (3 tier: Starter, Pro, Enterprise)
- Testimonials (6 review)
- Final CTA
- Footer dengan kolom link + social media

Semua konten teks ada di dalam `src/pages/Landing.tsx` — edit langsung di sana.

## Login (`/login`)

- Toggle Login / Register
- Mouse-tracking gradient animation di panel kiri
- Error message animated (AnimatePresence)
- Redirect ke `/app` jika sudah login

## Dashboard (`/app`)

- Layout 3-panel horizontal dengan `react-resizable-panels`
- Panel kiri: sidebar navigasi (resizable 15–30%)
- Panel tengah: konten utama dengan stat cards (resizable, min 30%)
- Panel kanan: tab panel (Activity / Stats / Pro) (resizable 20–40%)
- Profile dropdown di header dengan animasi

## Profile (`/profile`)

- Tab "Profil & Keamanan": form edit username/email, ganti password
- Tab "Langganan": tampilan paket aktif, tombol upgrade, riwayat pembayaran
- Alert animasi untuk feedback form

## Support (`/support`)

- 3 view: list tiket, form buat tiket, detail tiket (chat)
- Chat interface dua arah (user ↔ admin)
- Status tiket: open, in_progress, resolved, closed

## Articles (`/articles`)

- Search full-text
- Filter per kategori (Berita, Tutorial, Analisis, Update)
- Grid card artikel dengan cover image / placeholder
- Footer dengan link navigasi

## ArticleDetail (`/articles/:slug`)

- Header dengan kategori badge dan meta info
- Cover image (jika ada)
- Excerpt highlight dengan border amber kiri
- Konten artikel (`whitespace-pre-wrap`)
- Link kembali + CTA support

## StaticPage (`/page/:slug`)

- Sidebar navigasi grouped by kategori
- Konten dari `PAGE_CONTENT` object (bukan API)
- Markdown sederhana (heading `###`, list `-`, bold `**`)
- Lihat [Static Pages](/guide/static-pages)

## Admin (`/admin`)

- Sidebar navigasi dengan 4 tab
- Lihat [Admin Panel](/guide/admin)

## PaymentSuccess / PaymentCancel

- `PaymentSuccess`: polling status tier user setiap 2 detik (max 5x), redirect ke `/app` jika sukses
- `PaymentCancel`: halaman sederhana dengan tombol kembali dan contact CS
