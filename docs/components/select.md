# Select

Berbasis `react-select` dengan dark theme custom.

## Preview

<iframe src="/preview?id=select" style="width:100%;height:300px;border:none;border-radius:12px;" loading="lazy" /> Support searchable, multi-select, async, dan grouping out of the box.

## Import

```ts
import { Select } from '@/components/Select'
import type { SelectOption } from '@/components/Select'
```

## Contoh

### Single Select

```tsx
const [category, setCategory] = useState<SelectOption | null>(null)

<Select
  label="Kategori"
  options={[
    { value: 'news',     label: 'Berita'    },
    { value: 'tutorial', label: 'Tutorial'  },
    { value: 'update',   label: 'Update'    },
  ]}
  value={category}
  onChange={setCategory}
  placeholder="Pilih kategori..."
/>
```

### Multi-Select

```tsx
const [tags, setTags] = useState<SelectOption[]>([])

<Select
  isMulti
  label="Tags"
  options={tagOptions}
  value={tags}
  onChange={val => setTags(val as SelectOption[])}
/>
```

### Dengan Search

```tsx
<Select
  isSearchable
  label="User"
  options={userOptions}
  value={selectedUser}
  onChange={setSelectedUser}
  placeholder="Cari user..."
/>
```

### Clearable

```tsx
<Select
  isClearable
  options={options}
  value={value}
  onChange={setValue}
/>
```

### Grouped Options

```tsx
<Select
  options={[
    {
      label: 'Frontend',
      options: [
        { value: 'react',   label: 'React'   },
        { value: 'vue',     label: 'Vue'     },
      ]
    },
    {
      label: 'Backend',
      options: [
        { value: 'node',    label: 'Node.js' },
        { value: 'django',  label: 'Django'  },
      ]
    }
  ]}
  value={value}
  onChange={setValue}
/>
```

### Loading / Async

```tsx
<Select
  isLoading
  loadingMessage={() => 'Memuat data...'}
  options={[]}
  value={null}
  onChange={() => {}}
/>
```

## Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `label` | `string` | — | Label di atas select |
| `error` | `string` | — | Pesan error |
| `hint` | `string` | — | Teks bantuan |
| `wrapperClassName` | `string` | — | Class untuk div pembungkus |
| `isMulti` | `boolean` | `false` | Multi-select |
| `isSearchable` | `boolean` | `true` | Aktifkan search input |
| `isClearable` | `boolean` | `false` | Tampilkan tombol hapus pilihan |
| `isLoading` | `boolean` | `false` | Tampilkan loading state |
| `isDisabled` | `boolean` | `false` | Disable select |

::: tip
Semua props `react-select` diteruskan langsung. Lihat [dokumentasi react-select](https://react-select.com/props) untuk props lengkap.
:::

## SelectOption Type

```ts
interface SelectOption<V = string> {
  value: V
  label: string
}
```

Komponen ini generik — nilai `value` bisa bertipe apapun:

```tsx
// Select dengan value bertipe number
const options: SelectOption<number>[] = [
  { value: 1, label: 'Satu' },
  { value: 2, label: 'Dua' },
]

<Select<number>
  options={options}
  value={selectedOption}
  onChange={setSelectedOption}
/>
```
