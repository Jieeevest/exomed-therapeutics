# Navbar & ProGate

## Navbar

Navigasi atas fixed untuk halaman publik dengan efek scroll-aware.

### Import

```ts
import { Navbar } from '@/components/Navbar'
```

### Penggunaan

Cukup render di bagian paling atas halaman publik:

```tsx
export default function Articles() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />
      {/* Konten halaman — tambahkan pt-16 untuk kompensasi navbar fixed */}
      <div className="pt-16">
        ...
      </div>
    </div>
  )
}
```

Halaman yang sudah menggunakan Navbar: `Articles`, `ArticleDetail`, `Support`, `StaticPage`.

### Fitur

- **Fixed positioning** — selalu di atas saat scroll
- **Scroll-aware** — background transparan saat di atas, berubah gelap saat di-scroll
- **Auth-aware** — tampilkan tombol "Dashboard" jika sudah login, "Masuk / Coba Gratis" jika belum
- **Mobile menu** — hamburger menu dengan animasi untuk layar kecil

### Link Navbar

Default: Fitur, Harga, Artikel, Support

Untuk mengganti link, edit `src/components/Navbar.tsx` bagian desktop nav dan mobile menu.

---

## ProGate

Membatasi konten hanya untuk user Pro. User non-Pro melihat overlay blur dengan tombol upgrade.

### Import

```ts
import { ProGate } from '@/components/ProGate'
```

### Penggunaan

```tsx
<ProGate feature="Panel Analytics Lanjutan">
  <AnalyticsPanel />
</ProGate>

{/* Nama fitur muncul di overlay */}
<ProGate feature="Ekspor Data CSV">
  <ExportButton />
</ProGate>
```

### Cara Kerja

1. Cek `user.subscription_tier === 'pro'` dari auth store
2. Jika **Pro**: render children langsung
3. Jika **non-Pro**: render children tapi dengan `blur-sm` dan `pointer-events-none`, lalu overlay blur + CTA upgrade

### Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `feature` | `string` | `'fitur ini'` | Nama fitur yang ditampilkan di overlay upgrade |
| `children` | `ReactNode` | — | Konten yang dilindungi |

### Mengubah Harga di CTA

Edit `src/components/ProGate.tsx`:

```tsx
<Link to="/profile" className="...">
  <Crown className="w-4 h-4" />
  Upgrade ke PRO {/* tambahkan harga di sini jika perlu */}
</Link>
```

::: warning Konsistensi
Setiap kali menambah fitur baru di balik ProGate, update juga daftar fitur di `src/pages/Profile.tsx` agar user tahu apa yang mereka dapatkan dengan upgrade.
:::
