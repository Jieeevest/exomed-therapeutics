# Avatar

Komponen avatar berbasis inisial dengan warna otomatis dari nama user.

## Preview

<iframe src="/preview?id=avatar" style="width:100%;height:160px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { Avatar } from '@/components/Avatar'
```

## Contoh

```tsx
{/* Dari nama user — warna otomatis */}
<Avatar name="Budi Santoso" />
<Avatar name="Citra Nadia" size="lg" />
<Avatar name="Dimas Kurniawan" size="xl" />

{/* Gold gradient */}
<Avatar name={user.username} size="md" useGold />

{/* Tanpa nama — tampil "U" */}
<Avatar size="sm" />

{/* Di profil user */}
<div className="flex items-center gap-4">
  <Avatar name={user.username} size="xl" useGold />
  <div>
    <h2 className="text-xl font-bold">{user.username}</h2>
    <p className="text-sm text-slate-400">{user.email}</p>
  </div>
</div>
```

## Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `name` | `string` | — | Nama user untuk inisial dan pilihan warna |
| `size` | `sm \| md \| lg \| xl` | `md` | Ukuran avatar |
| `useGold` | `boolean` | `false` | Pakai gold gradient sebagai background |
| `className` | `string` | — | Class tambahan |

## Ukuran

| Size | Dimensi | Font |
|---|---|---|
| `sm` | `24px × 24px` | `10px` |
| `md` | `28px × 28px` | `12px` |
| `lg` | `40px × 40px` | `14px` |
| `xl` | `64px × 64px` | `24px` |

## Pemilihan Warna

Warna dipilih secara deterministik berdasarkan karakter pertama nama (bukan random). Ini berarti nama yang sama selalu menghasilkan warna yang sama di semua sesi.

Tersedia 6 warna gradient berbeda. Jika tidak ada nama, avatar tampil dengan warna default (gradient pertama) dan inisial "U".

## Penggunaan di Navbar

```tsx
<Avatar
  name={user?.username}
  size="md"
  useGold
  className="shadow-inner"
/>
```

## Penggunaan di Chat Bubble

```tsx
<div className={`w-10 h-10 rounded-full flex items-center justify-center
                 text-xs font-black shrink-0
                 ${isAdmin ? 'bg-primary/20 text-primary' : ''}`}>
  {isAdmin
    ? 'CS'
    : <Avatar name={reply.username} size="lg" />
  }
</div>
```
