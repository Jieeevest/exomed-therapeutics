# Spinner

Indikator loading berbentuk lingkaran berputar.

## Preview

<iframe src="/preview?id=spinner" style="width:100%;height:170px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { Spinner } from '@/components/Spinner'
```

## Contoh

```tsx
{/* Default: md, warna primary (gold) */}
<Spinner />

{/* Ukuran */}
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

{/* Warna */}
<Spinner color="primary" />  {/* gold — untuk background gelap */}
<Spinner color="white" />    {/* putih — untuk background gelap */}
<Spinner color="black" />    {/* hitam — untuk background terang / gold button */}
```

## Loading Page

```tsx
if (loading) return (
  <div className="flex items-center justify-center py-20">
    <Spinner size="lg" />
  </div>
)
```

## Loading Overlay

```tsx
<div className="relative">
  {loading && (
    <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm
                    flex items-center justify-center rounded-2xl z-10">
      <Spinner size="lg" />
    </div>
  )}
  {/* Konten */}
</div>
```

## Props

| Prop | Tipe | Default |
|---|---|---|
| `size` | `sm \| md \| lg` | `md` |
| `color` | `primary \| white \| black` | `primary` |
| `className` | `string` | — |

| Size | Dimensi | Border |
|---|---|---|
| `sm` | `16px × 16px` | `2px` |
| `md` | `24px × 24px` | `2px` |
| `lg` | `32px × 32px` | `3px` |
