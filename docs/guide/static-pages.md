# Static Pages

Halaman statis dirender dari object `PAGE_CONTENT` di `src/pages/StaticPage.tsx` — tidak ada API call, konten langsung di-hardcode.

## Halaman Bawaan

| Slug | Judul | Kategori |
|---|---|---|
| `changelog` | Changelog | Produk |
| `roadmap` | Roadmap Pengembangan | Produk |
| `dokumentasi` | Pusat Dokumentasi | Support |
| `faq` | FAQ | Support |
| `status` | Status Sistem | Support |
| `terms` | Syarat & Ketentuan | Legal |
| `privacy` | Kebijakan Privasi | Legal |
| `disclaimer` | Disclaimer | Legal |

Akses via `/page/{slug}`, contoh: `/page/faq`

## Menambah Halaman Baru

Edit `src/pages/StaticPage.tsx`:

```ts
const PAGE_CONTENT: Record<string, { title: string; category: string; date: string; content: string }> = {
  // ...yang sudah ada

  'kebijakan-cookie': {
    title: 'Kebijakan Cookie',
    category: 'Legal',           // untuk grouping di sidebar
    date: 'Berlaku sejak: 1 Jan 2026',
    content: `### Apa itu Cookie?

Kami menggunakan cookie untuk meningkatkan pengalaman pengguna.

### Jenis Cookie yang Kami Gunakan

- **Cookie Esensial:** Diperlukan agar website berfungsi
- **Cookie Analitik:** Membantu kami memahami penggunaan website`
  }
}
```

Halaman langsung bisa diakses di `/page/kebijakan-cookie` dan otomatis muncul di sidebar navigasi.

## Format Konten (Markdown Sederhana)

Parser markdown custom (tanpa library eksternal) mendukung:

| Sintaks | Hasil |
|---|---|
| `### Judul` | Heading h3 |
| `**teks**` | **Bold** |
| `- item` | List item dengan bullet |
| Baris kosong | Pemisah paragraf |

Contoh:

```
### Cara Menggunakan

Ikuti langkah-langkah berikut untuk memulai:

- **Langkah 1:** Buka halaman dashboard
- **Langkah 2:** Pilih menu yang Anda butuhkan
- **Langkah 3:** Ikuti instruksi di layar

Jika mengalami kendala, hubungi tim support kami.
```

## Sidebar Navigasi

Sidebar dibangun secara otomatis dari `PAGE_CONTENT` dengan grouping berdasarkan `category`. Icon per halaman dikonfigurasi di `ICON_MAP`:

```ts
const ICON_MAP: Record<string, any> = {
  changelog:    ListChecks,
  roadmap:      Map,
  dokumentasi:  FileText,
  faq:          HelpCircle,
  status:       Activity,
  terms:        Scale,
  privacy:      ShieldCheck,
  disclaimer:   FileText,
  // tambahkan slug baru di sini jika ingin custom icon
}
```

Halaman tanpa entry di `ICON_MAP` otomatis menggunakan icon `FileText`.
