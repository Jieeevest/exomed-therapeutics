# PageHeader

Header halaman dengan judul, deskripsi opsional, dan slot aksi.

## Preview

<iframe src="/preview?id=pageheader" style="width:100%;height:240px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { PageHeader } from '@/components/PageHeader'
```

## Contoh

```tsx
import { Plus, Download } from 'lucide-react'

{/* Minimal */}
<PageHeader title="User Management" />

{/* Dengan deskripsi */}
<PageHeader
  title="User Management"
  description="Kelola semua pengguna dan role mereka secara real-time."
/>

{/* Dengan satu aksi */}
<PageHeader
  title="Content & Articles"
  description="Tulis dan kelola artikel yang tampil di halaman publik."
  action={
    <Button
      variant="primary"
      size="sm"
      onClick={() => setFormOpen(true)}
    >
      <Plus className="w-4 h-4" /> Tulis Artikel
    </Button>
  }
/>

{/* Dengan beberapa aksi */}
<PageHeader
  title="Laporan"
  action={
    <>
      <Button variant="secondary" size="sm">
        <Download className="w-4 h-4" /> Export CSV
      </Button>
      <Button variant="primary" size="sm">
        Tambah Data
      </Button>
    </>
  }
/>
```

## Props

| Prop | Tipe | Keterangan |
|---|---|---|
| `title` | `string` | Judul halaman |
| `description` | `string` | Teks deskripsi di bawah judul (opsional) |
| `action` | `ReactNode` | Slot untuk tombol atau elemen lain di sisi kanan (opsional) |
| `className` | `string` | Class tambahan untuk `<header>` |

## Dalam Layout Admin

```tsx
export default function Admin() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <PageHeader
          title={NAV_ITEMS.find(n => n.id === activeTab)?.label ?? ''}
          description="Kelola data dan konfigurasi sistem."
          action={activeTab === 'articles' && (
            <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
              + Artikel Baru
            </Button>
          )}
        />

        {/* Konten tab */}
      </div>
    </main>
  )
}
```
