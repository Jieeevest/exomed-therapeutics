# Alert & Badge

## Preview — Alert

<iframe src="/preview?id=alert" style="width:100%;height:240px;border:none;border-radius:12px;" loading="lazy" />

## Preview — Badge

<iframe src="/preview?id=badge" style="width:100%;height:120px;border:none;border-radius:12px;" loading="lazy" />

## Alert

Pesan notifikasi dengan animasi height collapse saat muncul dan menghilang.

### Import

```ts
import { Alert } from '@/components/Alert'
```

### Contoh

```tsx
{/* Muncul saat message tidak null/undefined */}
<Alert variant="success" message="Data berhasil disimpan!" />
<Alert variant="error"   message={errorMsg} />
<Alert variant="warning" message="Sesi akan berakhir dalam 5 menit." />
<Alert variant="info"    message="Update baru tersedia." />

{/* Tidak render apa-apa jika message null */}
<Alert variant="error" message={null} />
```

### Penggunaan dalam Form

```tsx
const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

const handleSubmit = async () => {
  try {
    await save()
    setMsg({ type: 'success', text: 'Berhasil disimpan!' })
  } catch {
    setMsg({ type: 'error', text: 'Gagal menyimpan. Coba lagi.' })
  }
}

return (
  <form>
    <Alert variant={msg?.type ?? 'error'} message={msg?.text} />
    {/* ...fields */}
  </form>
)
```

### Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `variant` | `success \| error \| warning \| info` | `error` | Warna dan icon |
| `message` | `string \| null \| undefined` | — | Pesan yang ditampilkan. Jika falsy → tidak render |
| `className` | `string` | — | Class tambahan |

---

## Badge

Chip status kecil dengan berbagai warna.

### Import

```ts
import { Badge } from '@/components/Badge'
```

### Contoh

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>
<Badge variant="pro">PRO</Badge>
<Badge variant="muted">Starter</Badge>
<Badge variant="primary">Featured</Badge>
<Badge variant="amber">Beta</Badge>

{/* Ukuran kecil */}
<Badge variant="success" size="sm">Live</Badge>
```

### Dalam Tabel

```tsx
<Table.Cell>
  <Badge variant={
    user.subscription_tier === 'pro' ? 'pro' : 'muted'
  }>
    {user.subscription_tier.toUpperCase()}
  </Badge>
</Table.Cell>

<Table.Cell>
  <Badge variant={
    payment.status === 'berhasil' ? 'success' :
    payment.status === 'pending'  ? 'warning' : 'error'
  }>
    {payment.status}
  </Badge>
</Table.Cell>
```

### Props

| Prop | Tipe | Default |
|---|---|---|
| `variant` | `success \| warning \| error \| info \| muted \| pro \| primary \| amber` | `muted` |
| `size` | `sm \| md` | `md` |
| `className` | `string` | — |
