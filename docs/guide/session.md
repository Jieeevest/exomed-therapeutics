# Session Guard

## useSessionGuard

File: `src/hooks/useSessionGuard.ts`

Hook yang secara proaktif memantau validitas sesi user. **Wajib dipanggil di setiap halaman protected.**

```ts
import { useSessionGuard } from '@/hooks/useSessionGuard'

export default function Dashboard() {
  useSessionGuard() // ← baris pertama setelah deklarasi hooks lain
  // ...
}
```

## Cara Kerjanya

Hook ini memeriksa `sessionStorage` pada tiga kondisi:

| Trigger | Keterangan |
|---|---|
| Mount awal | Langsung cek saat komponen pertama kali render |
| Tab focus | Saat user kembali ke tab browser (`window focus`) |
| Tab visibility | Saat tab kembali aktif (`visibilitychange`) |
| Interval 30 detik | Cek periodik selama halaman terbuka |

**Yang diperiksa:**
1. Apakah entry `app-auth-storage` masih ada di sessionStorage
2. Apakah `state.accessToken` di dalam entry masih ada

Jika salah satu gagal → `logout()` dipanggil → redirect ke `/login`.

## Mengapa sessionStorage?

Berbeda dengan `localStorage` yang persisten antar sesi, `sessionStorage` hanya hidup selama satu tab browser. Ini berarti:

- **Tab ditutup** → sesi berakhir otomatis
- **Browser di-restart** → sesi berakhir otomatis  
- **Buka tab baru** → harus login ulang
- **Refresh halaman** → sesi tetap aktif (masih tab yang sama)

Pilihan ini dibuat secara sengaja untuk keamanan — token tidak bertahan permanen di browser user.
