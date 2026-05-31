# Pengenalan

SaaS Boilerplate adalah template aplikasi web React yang sudah lengkap dengan infrastruktur dasar yang dibutuhkan hampir semua aplikasi SaaS: autentikasi, manajemen langganan, admin panel, CMS artikel, dan sistem tiket support.

## Untuk Apa Boilerplate Ini?

Daripada membangun ulang hal yang sama dari nol di setiap proyek baru, boilerplate ini menyediakan fondasi yang sudah teruji dan siap dikustomisasi. Fokus pada fitur bisnis unik Anda — bukan infrastruktur.

## Tech Stack

| Kategori | Library | Versi |
|---|---|---|
| Framework | React | 18 |
| Language | TypeScript | ~5.6 |
| Build tool | Vite | 6 |
| Routing | react-router-dom | 7 |
| State | Zustand | 5 |
| Animasi | Framer Motion | 11 |
| Styling | Tailwind CSS | 3 |
| UI Primitives | Radix UI | — |
| Select | react-select | — |
| Icons | Lucide React | — |
| Font | Space Grotesk | — |

## Yang Sudah Tersedia

**Halaman:**
- Landing page lengkap (hero, fitur, pricing, testimonial, footer)
- Login + Register dengan toggle animasi
- Dashboard 3-panel dengan resizable panels
- Profil user & manajemen langganan
- Sistem tiket support (chat dua arah)
- Daftar & detail artikel dengan search/filter
- Halaman statis (terms, privacy, faq, dll)
- Admin panel (users, payments, tickets, articles)
- Payment success & cancel

**Infrastruktur:**
- JWT auth dengan auto refresh token
- Session guard (polling + tab focus)
- Protected route & admin route
- fetchWithAuth dengan retry logic
- ProGate untuk feature gating

**UI Components (20 komponen):**
Button, Input, Textarea, Select, Alert, Badge, Spinner, Modal, Card, StatCard, Table, Pagination, EmptyState, Avatar, Tabs, SidebarNav, PageHeader, Navbar, ProGate, Logo
