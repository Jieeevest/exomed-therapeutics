# EmptyState

Tampilan kosong dengan icon, judul, deskripsi, dan tombol aksi opsional.

## Preview

<iframe src="/preview?id=emptystate" style="width:100%;height:360px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { EmptyState } from '@/components/EmptyState'
```

## Contoh

```tsx
import { Search, Ticket, FileText, Users } from 'lucide-react'

{/* Tanpa aksi */}
<EmptyState
  icon={<Search className="w-10 h-10" />}
  title="Tidak Ada Hasil"
  description="Coba ubah kata kunci atau filter pencarian Anda."
/>

{/* Dengan aksi */}
<EmptyState
  icon={<Ticket className="w-10 h-10" />}
  title="Belum Ada Tiket"
  description="Apakah Anda mengalami kendala? Buat tiket laporan pertama Anda sekarang."
  action={{
    label: 'Buat Tiket Baru',
    onClick: () => setView('create')
  }}
/>

{/* Dalam tabel */}
<EmptyState
  icon={<Users className="w-10 h-10" />}
  title="Belum Ada Pengguna"
  description="Pengguna yang mendaftar akan muncul di sini."
/>
```

## Props

| Prop | Tipe | Keterangan |
|---|---|---|
| `icon` | `ReactNode` | Icon SVG — disarankan `w-10 h-10` |
| `title` | `string` | Judul utama |
| `description` | `string` | Teks penjelasan (opsional) |
| `action` | `{ label: string, onClick: () => void }` | Tombol aksi (opsional) |
| `className` | `string` | Class tambahan |

## Tips

Gunakan di dalam `Table.Empty` untuk tabel dengan baris kosong, atau langsung sebagai pengganti konten halaman saat data kosong:

```tsx
{articles.length === 0 ? (
  <EmptyState
    icon={<FileText className="w-10 h-10" />}
    title="Belum Ada Artikel"
    description="Artikel yang dipublikasikan akan muncul di sini."
    action={{ label: 'Tulis Artikel Pertama', onClick: () => setFormOpen(true) }}
  />
) : (
  <div className="grid gap-4">
    {articles.map(a => <ArticleCard key={a.id} article={a} />)}
  </div>
)}
```
