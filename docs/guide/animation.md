# Animasi (Framer Motion)

Framer Motion sudah terinstall dan dipakai di seluruh proyek. Berikut pola-pola yang konsisten digunakan.

## Entrance Animation

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  Konten
</motion.div>
```

Untuk staggered children (animasi berurutan):

```tsx
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
  />
))}
```

## Conditional Render dengan AnimatePresence

```tsx
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.15 }}
    >
      Dropdown / Modal / Notifikasi
    </motion.div>
  )}
</AnimatePresence>
```

::: warning
`AnimatePresence` harus membungkus element yang bisa unmount. Tanpa ini, animasi `exit` tidak akan berjalan.
:::

## Button Tap Feedback

```tsx
<motion.button
  whileTap={{ scale: 0.97 }}
  disabled={isLoading}
>
  Klik Saya
</motion.button>
```

Untuk button yang disabled, tambahkan kondisi:

```tsx
whileTap={{ scale: isDisabled ? 1 : 0.97 }}
```

## Scroll-based Animation (useInView)

Untuk animasi saat elemen masuk viewport:

```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function AnimatedSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      Muncul saat di-scroll
    </motion.div>
  )
}
```

## Scroll-based Navbar

Pattern untuk navbar yang berubah saat di-scroll (dipakai di `Landing.tsx` dan `Navbar.tsx`):

```tsx
import { motion, useScroll, useTransform } from 'framer-motion'

const { scrollY } = useScroll()
const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(5,5,5,0.95)'])

<motion.nav style={{ backgroundColor: navBg }}>
  {/* Navbar content */}
</motion.nav>
```

## AnimatePresence mode="wait"

Untuk transisi antar konten (tab switching):

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}   // ← key harus berubah untuk trigger animasi
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {activeTab === 'a' ? <TabA /> : <TabB />}
  </motion.div>
</AnimatePresence>
```
