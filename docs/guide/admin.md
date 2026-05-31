# Admin Panel

Halaman `/admin` hanya bisa diakses oleh user dengan `role === 'admin'`.

## Tab yang Tersedia

### User Management

- Tabel semua user dengan username, email, role, subscription tier, tanggal bergabung
- Ubah role user (user/admin) langsung dari dropdown di tabel
- Hapus user (dengan konfirmasi browser)
- Stat cards: total user aktif, jumlah Pro, jumlah Starter

### Transactions

- Histori semua transaksi pembayaran
- Kolom: ID transaksi, nama user, nominal, status (berhasil/pending/gagal), tanggal

### Support Tickets

- Daftar semua tiket yang masuk dari semua user
- Klik baris untuk buka detail tiket dalam modal chat
- Di dalam modal: balas tiket, ubah status (open/in_progress/resolved/closed)

### Content & Articles

- Daftar artikel dengan status published/draft
- Tombol "+ Tulis Artikel Baru" membuka form modal
- Edit dan hapus artikel dari tabel

## Menambah Tab Baru

```tsx
// src/pages/Admin.tsx

// 1. Tambah ke type Tab
type Tab = 'users' | 'payments' | 'tickets' | 'articles' | 'laporan'

// 2. Tambah ke NAV_ITEMS
const NAV_ITEMS = [
  // ...
  { id: 'laporan', label: 'Laporan', icon: BarChart2 },
]

// 3. Tambah fetch di fetchData()
if (activeTab === 'laporan') {
  const res = await fetch(`${API_URL}/api/laporan`, { headers: { Authorization: `Bearer ${accessToken}` } })
  const data = await res.json()
  if (data.success) setLaporan(data.data)
}

// 4. Tambah render di main area
{activeTab === 'laporan' && (
  <div>
    {/* Konten tab laporan */}
  </div>
)}
```

## API Calls Admin

Semua request admin menggunakan `accessToken` di header Authorization. Format konsisten di seluruh tab:

```ts
const res = await fetch(`${API_URL}/api/endpoint`, {
  headers: { Authorization: `Bearer ${accessToken}` }
})
```

`API_URL` di-read dari `import.meta.env.VITE_API_URL`.

## Proteksi Ganda

Admin panel dilindungi di dua lapisan:

1. **Route level** — `<AdminRoute>` di `App.tsx` redirect non-admin ke `/app`
2. **Component level** — `useEffect` di dalam `Admin.tsx` juga cek `user?.role !== 'admin'`

Ini memastikan bahkan jika routing dibypass, komponen tetap aman.
