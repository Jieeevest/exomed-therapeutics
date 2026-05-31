# Modal

Dialog overlay dengan backdrop blur, animasi masuk/keluar, dan slot header/body/footer.

## Preview

<iframe src="/preview?id=modal" style="width:100%;height:100px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { Modal } from '@/components/Modal'
```

## Contoh

### Konfirmasi Hapus

```tsx
const [open, setOpen] = useState(false)

<Button variant="destructive" onClick={() => setOpen(true)}>
  Hapus User
</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Konfirmasi Hapus"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
      <Button variant="destructive" loading={isDeleting} onClick={handleDelete}>
        Hapus
      </Button>
    </>
  }
>
  <p className="text-slate-400 text-sm">
    Apakah Anda yakin ingin menghapus user ini? Aksi ini tidak bisa dibatalkan.
  </p>
</Modal>
```

### Form Modal

```tsx
<Modal
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title="Tambah Artikel"
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={() => setFormOpen(false)}>Batal</Button>
      <Button variant="primary" loading={isSaving} onClick={handleSave}>
        Simpan Artikel
      </Button>
    </>
  }
>
  <div className="space-y-4">
    <Input label="Judul" value={title} onChange={e => setTitle(e.target.value)} />
    <Textarea label="Konten" rows={8} value={content} onChange={e => setContent(e.target.value)} />
  </div>
</Modal>
```

### Tanpa Title

```tsx
<Modal open={open} onClose={() => setOpen(false)} size="md">
  <div className="text-center py-4">
    {/* Konten custom */}
  </div>
</Modal>
```

## Props

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `open` | `boolean` | — | Kontrol visibility |
| `onClose` | `() => void` | — | Dipanggil saat backdrop atau ✕ diklik |
| `title` | `string` | — | Header modal (opsional — jika tidak ada, header tidak render) |
| `size` | `sm \| md \| lg \| xl` | `md` | Lebar modal |
| `footer` | `ReactNode` | — | Konten footer, biasanya tombol aksi |
| `children` | `ReactNode` | — | Konten body |
| `className` | `string` | — | Class tambahan untuk panel |

## Ukuran

| Size | Max Width |
|---|---|
| `sm` | `448px` |
| `md` | `672px` |
| `lg` | `768px` |
| `xl` | `1280px` |

## Animasi

Modal menggunakan `AnimatePresence` sehingga animasi exit berjalan sebelum unmount:

- Backdrop: fade in/out
- Panel: scale + fade + slide up sedikit
