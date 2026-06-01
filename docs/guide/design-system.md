# Warna & Tema

## CSS Custom Properties

Semua token warna didefinisikan di `src/index.css` menggunakan format HSL. Ini memungkinkan kustomisasi tema cukup dengan mengganti satu nilai.

```css
/* src/index.css */
:root {
  --background: 0 0% 4%; /* Background utama */
  --foreground: 0 0% 98%; /* Teks utama */
  --card: 0 0% 7%; /* Background card */
  --card-foreground: 0 0% 98%;
  --primary: 179 25% 41%; /* Aksen (rgb(78 130 129)) */
  --primary-foreground: 0 0% 0%;
  --muted: 0 0% 14%; /* Background muted */
  --muted-foreground: 0 0% 65%; /* Teks sekunder */
  --border: 0 0% 15%; /* Border semua elemen */
}
```

Di Tailwind, gunakan token ini sebagai class:

```tsx
<div className="bg-background text-foreground border-border" />
<div className="bg-card text-card-foreground" />
<div className="text-muted-foreground bg-muted" />
<button className="bg-primary text-primary-foreground" />
```

## Mengganti Warna Primary

Untuk mengubah aksen gold menjadi warna brand Anda:

```css
:root {
  --primary: 221 83% 53%; /* Contoh: biru */
}
```

Format: `H S% L%` (Hue Saturation Lightness).

## Gold Gradient

Dua utility class khusus yang didefinisikan di `@layer utilities`:

```tsx
// Background gradient emas — untuk CTA button
<button className="bg-gold-gradient text-black">
  Upgrade ke Pro
</button>

// Text gradient emas — untuk headline
<h1>
  Platform <span className="text-gold-gradient">Terbaik</span>
</h1>
```

Untuk mengganti warna gradient, edit di `src/index.css`:

```css
.bg-gold-gradient {
  background: linear-gradient(
    135deg,
    rgb(122 183 182) 0%,
    rgb(78 130 129) 40%,
    rgb(48 80 79) 100%
  );
}
```

## Pola Glassmorphism

Pattern standar untuk card di atas background gelap:

```tsx
{/* Card standar */}
<div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">

{/* Card dengan hover glow */}
<div className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6
                hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-300">
  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent
                  to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <div className="relative z-10">
    {/* Konten */}
  </div>
</div>
```

## Font

Space Grotesk diload via `@fontsource/space-grotesk` di `src/main.tsx` dan dikonfigurasi sebagai font default di `tailwind.config.js`.

Tidak perlu konfigurasi tambahan — berlaku otomatis untuk semua teks.

## Utility cn()

Selalu gunakan `cn()` dari `@/lib/utils` untuk class kondisional:

```ts
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class rounded-xl px-4 py-3',
  isActive && 'bg-primary/10 text-primary border border-primary/20',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className  // dari props — selalu taruh di akhir
)} />
```

`cn()` menggabungkan `clsx` (kondisional) dengan `tailwind-merge` (menghapus konflik class).

## Scrollbar Custom

Scrollbar 4px minimalis berlaku global via `src/index.css`. Tidak perlu konfigurasi tambahan per-komponen.
