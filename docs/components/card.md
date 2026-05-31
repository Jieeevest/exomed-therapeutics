# Card & StatCard

## Preview — Card

<iframe src="/preview?id=card" style="width:100%;height:300px;border:none;border-radius:12px;" loading="lazy" />

## Preview — StatCard

<iframe src="/preview?id=statcard" style="width:100%;height:140px;border:none;border-radius:12px;" loading="lazy" />

## Card

Wrapper card gelap dengan sub-komponen `Card.Header` dan `Card.Footer`.

### Import

```ts
import { Card } from '@/components/Card'
```

### Contoh

```tsx
{/* Basic */}
<Card>
  <p className="text-slate-400">Konten card biasa.</p>
</Card>

{/* Dengan padding berbeda */}
<Card padding="sm">Konten</Card>
<Card padding="lg">Konten</Card>

{/* Dengan hover glow effect */}
<Card hover>
  <p>Hover saya untuk melihat efek glow.</p>
</Card>

{/* Dengan Header dan Footer */}
<Card hover>
  <Card.Header>
    <h3 className="font-bold text-white">Judul Section</h3>
    <p className="text-sm text-muted-foreground mt-0.5">Deskripsi singkat</p>
  </Card.Header>

  <div className="space-y-3">
    <Input label="Nama" value={name} onChange={e => setName(e.target.value)} />
    <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
  </div>

  <Card.Footer>
    <Button variant="ghost">Batal</Button>
    <Button variant="primary">Simpan</Button>
  </Card.Footer>
</Card>
```

### Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `hover` | `boolean` | `false` | Aktifkan efek glow saat hover |
| `padding` | `none \| sm \| md \| lg` | `md` | Padding internal |
| `className` | `string` | — | Class tambahan |

---

## StatCard

Card metrik dengan label, nilai besar, dan indikator perubahan.

### Import

```ts
import { StatCard } from '@/components/StatCard'
```

### Contoh

```tsx
import { Users, TrendingUp, DollarSign } from 'lucide-react'

<div className="grid grid-cols-3 gap-4">
  <StatCard
    label="Total Users"
    value="1,248"
    change="+12% dari bulan lalu"
    up={true}
    icon={<Users className="w-4 h-4 text-primary" />}
    accentColor="bg-primary/5"
  />

  <StatCard
    label="Revenue"
    value="Rp 4.2M"
    change="+8% dari bulan lalu"
    up={true}
    icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
    accentColor="bg-emerald-500/5"
  />

  <StatCard
    label="Churn Rate"
    value="3.2%"
    change="+0.5% dari bulan lalu"
    up={false}
    icon={<TrendingUp className="w-4 h-4 text-red-400" />}
    accentColor="bg-red-500/5"
  />
</div>
```

### Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `label` | `string` | — | Label kecil di atas nilai |
| `value` | `string \| number` | — | Nilai utama yang ditampilkan besar |
| `change` | `string` | — | Teks perubahan (opsional) |
| `up` | `boolean` | — | `true` → teks hijau, `false` → teks merah |
| `icon` | `ReactNode` | — | Icon di samping label |
| `accentColor` | `string` | `bg-primary/5` | Class Tailwind untuk accent background |
| `className` | `string` | — | Class tambahan |
