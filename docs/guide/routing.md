# Routing & Proteksi Halaman

## Daftar Route

| Route | Komponen | Akses |
|---|---|---|
| `/` | `Landing` | Publik |
| `/login` | `Login` | Publik (redirect ke /app jika sudah login) |
| `/articles` | `Articles` | Publik |
| `/articles/:slug` | `ArticleDetail` | Publik |
| `/page/:slug` | `StaticPage` | Publik |
| `/payment/success` | `PaymentSuccess` | Publik |
| `/payment/cancel` | `PaymentCancel` | Publik |
| `/app` | `Dashboard` | **Protected** |
| `/profile` | `Profile` | **Protected** |
| `/support` | `Support` | **Protected** |
| `/admin` | `Admin` | **Admin only** |

## ProtectedRoute

Redirect ke `/login` jika user belum autentikasi:

```tsx
// src/App.tsx — sudah terkonfigurasi
<Route element={<ProtectedRoute />}>
  <Route path="/app"     element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/support" element={<Support />} />
</Route>
```

**Menambah route protected baru:**
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/fitur-baru" element={<FiturBaru />} />
</Route>
```

## AdminRoute

Redirect ke `/login` jika belum login, redirect ke `/app` jika login tapi bukan admin:

```tsx
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<Admin />} />
</Route>
```

**Menambah route admin baru:**
```tsx
<Route element={<AdminRoute />}>
  <Route path="/admin/laporan" element={<Laporan />} />
</Route>
```

## ProGate — Gating Fitur Pro

Membatasi konten hanya untuk user dengan `subscription_tier === 'pro'`. User lain melihat overlay blur dengan tombol upgrade.

```tsx
import { ProGate } from '@/components/ProGate'

<ProGate feature="Laporan Analytics Lanjutan">
  {/* Hanya terlihat oleh user Pro */}
  <AnalyticsPanel />
</ProGate>
```

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `feature` | `string` | `'fitur ini'` | Nama fitur yang ditampilkan di overlay |
| `children` | `ReactNode` | — | Konten yang dilindungi |

::: tip Konsistensi
Jika menambah fitur Pro baru, update juga daftar fitur di `src/pages/Profile.tsx` agar konsisten dengan yang ditampilkan kepada user di halaman langganan.
:::
