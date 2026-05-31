# Cara Kustomisasi

Panduan langkah demi langkah untuk mengadaptasi boilerplate ini menjadi proyek baru Anda.

## 1. Ganti Branding

**Logo:**
Ganti file di `public/` dengan logo Anda, lalu update `src/components/Logo.tsx`:

```tsx
export function Logo({ className, variant = 'icon' }) {
  if (variant === 'horizontal') {
    return <img src="/logo-horizontal.png" alt="Nama App" className={className} />
  }
  return <img src="/logo-icon.png" alt="Nama App" className={className} />
}
```

**Nama aplikasi:**
Cari dan ganti `YourApp` di semua file `src/pages/`.

**Warna primary:**
```css
/* src/index.css */
:root {
  --primary: 221 83% 53%;  /* Ganti ke warna brand Anda (format HSL) */
}
```

**Gold gradient:**
```css
/* src/index.css */
.bg-gold-gradient {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

## 2. Hubungkan ke Backend

Update `.env.local`:
```env
VITE_API_URL=https://api.domain-anda.com
```

Update endpoint di `src/constants/apiUrls.ts` sesuai struktur API backend Anda.

## 3. Ganti Storage Key

Wajib dilakukan saat rename proyek — **harus sama di dua file**:

```ts
// src/store/useAuth.ts
name: 'nama-app-auth-storage'

// src/hooks/useSessionGuard.ts
const stored = sessionStorage.getItem('nama-app-auth-storage')
```

## 4. Tambah Halaman Baru

```tsx
// 1. Buat file src/pages/HalamanBaru.tsx
import { useSessionGuard } from '@/hooks/useSessionGuard'

export default function HalamanBaru() {
  useSessionGuard()  // jika protected
  return <div>Konten halaman baru</div>
}

// 2. Daftarkan di src/App.tsx
<Route element={<ProtectedRoute />}>
  <Route path="/halaman-baru" element={<HalamanBaru />} />
</Route>
```

## 5. Tambah Fitur Pro

Bungkus konten dengan `ProGate`:

```tsx
<ProGate feature="Nama Fitur Baru">
  <KomponenFiturBaru />
</ProGate>
```

Lalu update daftar fitur di `src/pages/Profile.tsx`:

```tsx
// Di bagian daftar fitur Starter vs Pro
{ f: 'Nama Fitur Baru', pro: true },
```

## 6. Tambah Static Page

Edit `src/pages/StaticPage.tsx`, tambahkan ke `PAGE_CONTENT`:

```ts
const PAGE_CONTENT = {
  // yang sudah ada...
  'kebijakan-cookie': {
    title: 'Kebijakan Cookie',
    category: 'Legal',
    date: 'Berlaku sejak: 1 Januari 2025',
    content: `### Apa itu Cookie?\n\nKonten markdown di sini...`
  }
}
```

Halaman otomatis muncul di sidebar dan bisa diakses di `/page/kebijakan-cookie`.

## 7. Tambah Tab Admin

```tsx
// src/pages/Admin.tsx

// Tambah item di NAV_ITEMS
const NAV_ITEMS = [
  // ...yang sudah ada
  { id: 'laporan', label: 'Laporan', icon: BarChart2 },
]

// Tambah type
type Tab = 'users' | 'payments' | 'tickets' | 'articles' | 'laporan'

// Tambah render di main area
{activeTab === 'laporan' && (
  <div>
    {/* Konten tab laporan */}
  </div>
)}
```

## 8. Ganti Pricing

Edit `src/pages/Landing.tsx` di bagian section `#harga`:

```tsx
<PricingCard
  plan="Starter"
  price="Gratis"
  features={[
    'Fitur A',
    'Fitur B',
    // ...
  ]}
/>
<PricingCard
  plan="Pro"
  price="Rp XX.XXX"
  highlight
  badge="Paling Populer"
  features={[
    // ...
  ]}
/>
```
