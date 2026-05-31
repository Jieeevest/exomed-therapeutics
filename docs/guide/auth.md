# Autentikasi & JWT

## Alur Login

```
User submit form
      ↓
POST /api/auth/login  { email, password }
      ↓
Terima { accessToken, refreshToken, user }
      ↓
Simpan ke Zustand store → persist ke sessionStorage
      ↓
Redirect ke /app
```

## Auth Store

File: `src/store/useAuth.ts`

```ts
const {
  user,
  isAuthenticated,
  accessToken,
  refreshToken,
  login,
  logout,
  updateUser
} = useAuth()
```

| Property / Method | Tipe | Keterangan |
|---|---|---|
| `isAuthenticated` | `boolean` | Status login |
| `user` | `User \| null` | Data user aktif |
| `accessToken` | `string \| null` | JWT untuk request |
| `login(at, rt, user)` | `fn` | Set state setelah login |
| `logout()` | `fn` | Reset semua state |
| `updateUser(user)` | `fn` | Update data user tanpa logout |

### Tipe User

```ts
interface User {
  id: string
  username: string
  email: string
  role: string                  // 'user' | 'admin'
  subscription_tier: string     // 'starter' | 'pro'
  created_at?: string
}
```

### Persistensi

State disimpan di `sessionStorage` dengan key `app-auth-storage`. Sesi otomatis berakhir saat browser/tab ditutup — berbeda dengan `localStorage` yang persisten permanen.

::: warning Ganti storage key saat rename proyek
Jika mengganti nama aplikasi, update key di dua tempat yang harus sama:
- `src/store/useAuth.ts` → `name: 'nama-app-auth-storage'`
- `src/hooks/useSessionGuard.ts` → `sessionStorage.getItem('nama-app-auth-storage')`
:::

## fetchWithAuth

File: `src/lib/api.ts`

Gunakan untuk **semua request yang butuh autentikasi**:

```ts
import { fetchWithAuth } from '@/lib/api'

// GET
const res = await fetchWithAuth('/api/users/me')
const data = await res.json()

// POST / PUT
const res = await fetchWithAuth('/api/users/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email })
})
```

**Yang dilakukan secara otomatis:**

1. Ambil `accessToken` dari Zustand store
2. Tambahkan header `Authorization: Bearer <token>`
3. Jika response **401** → coba refresh via `POST /api/auth/refresh`
4. Jika refresh berhasil → ulangi request asli dengan token baru
5. Jika refresh gagal → `logout()` + redirect ke `/login`

::: tip
Endpoint publik (tidak butuh auth) tetap bisa pakai `fetch()` biasa. `fetchWithAuth` hanya untuk endpoint yang butuh token.
:::

## Token Refresh

Refresh token dikirim ke `POST /api/auth/refresh` dengan body:
```json
{ "refreshToken": "..." }
```

Backend diharapkan mengembalikan:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```
