# Button

Komponen tombol dengan 5 variant, 3 ukuran, dan loading state.

## Preview

<iframe src="/preview?id=button" style="width:100%;height:180px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { Button } from '@/components/Button'
```

## Contoh

```tsx
<Button variant="primary">Simpan</Button>
<Button variant="secondary">Batal</Button>
<Button variant="ghost">Lewati</Button>
<Button variant="destructive">Hapus</Button>
<Button variant="outline">Detail</Button>

{/* Loading state */}
<Button variant="primary" loading={isSubmitting}>
  Menyimpan...
</Button>

{/* Dengan icon */}
<Button variant="primary" size="sm">
  <Plus className="w-4 h-4" /> Tambah
</Button>

{/* Disabled */}
<Button disabled>Tidak Tersedia</Button>
```

## Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `variant` | `primary \| secondary \| ghost \| destructive \| outline` | `secondary` | Tampilan visual |
| `size` | `sm \| md \| lg` | `md` | Ukuran tombol |
| `loading` | `boolean` | `false` | Tampilkan spinner, disable klik |
| `disabled` | `boolean` | `false` | Disable tombol |
| `className` | `string` | — | Class tambahan |

Semua props native `<button>` HTML juga diteruskan (seperti `onClick`, `type`, dll).

## Variant

| Variant | Tampilan | Kapan Dipakai |
|---|---|---|
| `primary` | Gold gradient, teks hitam | CTA utama, aksi positif |
| `secondary` | Background putih transparan | Aksi sekunder |
| `ghost` | Transparan | Menu, aksi tersier |
| `destructive` | Merah transparan | Hapus, aksi berbahaya |
| `outline` | Border primary | Aksi opsional berbasis brand |

## Ukuran

| Size | Padding | Font |
|---|---|---|
| `sm` | `px-3 py-1.5` | `text-xs` |
| `md` | `px-5 py-2.5` | `text-sm` |
| `lg` | `px-8 py-4` | `text-base` |

## Loading State

Saat `loading={true}`:
- Spinner muncul di kiri teks
- Tombol tidak bisa diklik
- Opacity dikurangi

Warna spinner otomatis menyesuaikan variant: hitam untuk `primary`, putih untuk lainnya.
