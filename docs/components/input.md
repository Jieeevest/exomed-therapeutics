# Input & Textarea

## Preview — Input

<iframe src="/preview?id=input" style="width:100%;height:400px;border:none;border-radius:12px;" loading="lazy" />

## Preview — Textarea

<iframe src="/preview?id=textarea" style="width:100%;height:340px;border:none;border-radius:12px;" loading="lazy" />

## Input

### Import

```ts
import { Input } from '@/components/Input'
```

### Contoh

```tsx
import { Mail, Lock, Eye } from 'lucide-react'

{/* Basic */}
<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

{/* Dengan icon kiri */}
<Input
  label="Email"
  iconLeft={<Mail className="w-4 h-4" />}
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

{/* Dengan icon kanan */}
<Input
  label="Password"
  type="password"
  iconLeft={<Lock className="w-4 h-4" />}
  iconRight={<Eye className="w-4 h-4 cursor-pointer" onClick={toggleShow} />}
  value={password}
  onChange={e => setPassword(e.target.value)}
/>

{/* Dengan error */}
<Input
  label="Username"
  value={username}
  onChange={e => setUsername(e.target.value)}
  error="Username sudah digunakan."
/>

{/* Dengan hint */}
<Input
  label="Username"
  hint="Minimal 3 karakter, hanya huruf dan angka."
  value={username}
  onChange={e => setUsername(e.target.value)}
/>
```

### Props

| Prop | Tipe | Keterangan |
|---|---|---|
| `label` | `string` | Label di atas input |
| `error` | `string` | Pesan error — border berubah merah |
| `hint` | `string` | Teks bantuan (tidak muncul jika ada `error`) |
| `iconLeft` | `ReactNode` | Icon di sisi kiri |
| `iconRight` | `ReactNode` | Icon di sisi kanan |

Semua props native `<input>` HTML diteruskan (`type`, `placeholder`, `value`, `onChange`, `required`, dll).

---

## Textarea

API identik dengan `Input`, tambahan prop `resizable`.

### Import

```ts
import { Textarea } from '@/components/Textarea'
```

### Contoh

```tsx
{/* Basic */}
<Textarea
  label="Pesan"
  rows={5}
  placeholder="Tuliskan detail kendala Anda..."
  value={message}
  onChange={e => setMessage(e.target.value)}
/>

{/* Resizable */}
<Textarea
  label="Konten Artikel"
  rows={10}
  resizable
  value={content}
  onChange={e => setContent(e.target.value)}
/>

{/* Dengan error */}
<Textarea
  label="Deskripsi"
  value={desc}
  onChange={e => setDesc(e.target.value)}
  error="Deskripsi wajib diisi."
/>
```

### Props Tambahan

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `resizable` | `boolean` | `false` | `true` → user bisa resize secara vertikal |
