# Table & Pagination

## Preview — Table

<iframe src="/preview?id=table" style="width:100%;height:240px;border:none;border-radius:12px;" loading="lazy" />

## Preview — Pagination

<iframe src="/preview?id=pagination" style="width:100%;height:140px;border:none;border-radius:12px;" loading="lazy" />

## Table

Komponen tabel dengan loading overlay dan sub-komponen untuk struktur yang konsisten.

### Import

```ts
import { Table } from '@/components/Table'
```

### Contoh Lengkap

```tsx
<Table loading={isLoading}>
  <Table.Head>
    <Table.HeadCell>Pengguna</Table.HeadCell>
    <Table.HeadCell>Role</Table.HeadCell>
    <Table.HeadCell>Paket</Table.HeadCell>
    <Table.HeadCell>Bergabung</Table.HeadCell>
    <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
  </Table.Head>

  <Table.Body>
    {users.length === 0 ? (
      <Table.Empty colSpan={5} message="Belum ada pengguna terdaftar." />
    ) : users.map(user => (
      <Table.Row key={user.id} onClick={() => handleSelect(user)}>
        <Table.Cell>
          <div className="font-bold text-white">{user.username}</div>
          <div className="text-xs text-slate-500">{user.email}</div>
        </Table.Cell>
        <Table.Cell>
          <Badge variant={user.role === 'admin' ? 'warning' : 'muted'}>
            {user.role}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <Badge variant={user.subscription_tier === 'pro' ? 'pro' : 'muted'}>
            {user.subscription_tier}
          </Badge>
        </Table.Cell>
        <Table.Cell className="text-slate-400 text-xs">
          {new Date(user.created_at).toLocaleDateString('id-ID')}
        </Table.Cell>
        <Table.Cell className="text-right">
          <Button size="sm" variant="ghost">Edit</Button>
          <Button size="sm" variant="destructive">Hapus</Button>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Sub-Komponen

| Sub-komponen | Keterangan |
|---|---|
| `Table` | Wrapper utama. Prop `loading` menampilkan overlay spinner |
| `Table.Head` | Wrapper `<thead>` |
| `Table.HeadCell` | `<th>` dengan styling seragam |
| `Table.Body` | Wrapper `<tbody>` dengan divider antar baris |
| `Table.Row` | `<tr>` — prop `onClick` membuat baris bisa diklik |
| `Table.Cell` | `<td>` dengan padding standar |
| `Table.Empty` | Row kosong dengan pesan terpusat |

### Table.Empty Props

| Prop | Tipe | Default |
|---|---|---|
| `colSpan` | `number` | — |
| `message` | `string` | `'Tidak ada data.'` |

---

## Pagination

Navigasi halaman berbentuk tombol angka dengan ellipsis otomatis.

### Import

```ts
import { Pagination } from '@/components/Pagination'
```

### Contoh

```tsx
const [page, setPage] = useState(1)
const perPage = 10
const totalPages = Math.ceil(total / perPage)

<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

Output visual: `← Prev  1  ...  3  [4]  5  ...  20  Next →`

### Dengan siblingCount

```tsx
{/* Default siblingCount=1: tampilkan 1 angka di kiri/kanan halaman aktif */}
<Pagination page={5} totalPages={20} onPageChange={setPage} siblingCount={1} />
{/* → ← Prev  1  ...  4  [5]  6  ...  20  Next → */}

{/* siblingCount=2: tampilkan 2 angka */}
<Pagination page={5} totalPages={20} onPageChange={setPage} siblingCount={2} />
{/* → ← Prev  1  ...  3  4  [5]  6  7  ...  20  Next → */}
```

### Integrasi dengan Table

```tsx
const [page, setPage] = useState(1)
const PER_PAGE = 10

// Fetch data
useEffect(() => {
  fetchUsers({ page, limit: PER_PAGE })
}, [page])

return (
  <div className="space-y-4">
    <Table loading={loading}>
      {/* ... */}
    </Table>

    <div className="flex justify-end">
      <Pagination
        page={page}
        totalPages={Math.ceil(totalUsers / PER_PAGE)}
        onPageChange={setPage}
      />
    </div>
  </div>
)
```

### Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | `number` | — | Halaman aktif (1-indexed) |
| `totalPages` | `number` | — | Total halaman |
| `onPageChange` | `(page: number) => void` | — | Callback saat halaman berubah |
| `siblingCount` | `number` | `1` | Angka yang tampil di kiri/kanan halaman aktif |
| `className` | `string` | — | Class tambahan |

::: tip
Komponen tidak render apa-apa jika `totalPages <= 1`.
:::
