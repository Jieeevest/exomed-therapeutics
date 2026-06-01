import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, ChevronRight, ShieldCheck, Scale, HelpCircle, Activity, Map, ListChecks } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

// Icon mapping for sidebar
const ICON_MAP: Record<string, any> = {
  changelog: ListChecks,
  roadmap: Map,
  dokumentasi: FileText,
  faq: HelpCircle,
  status: Activity,
  terms: Scale,
  privacy: ShieldCheck,
  disclaimer: FileText
}

const PAGE_CONTENT: Record<string, { title: string; category: string; date: string; content: string }> = {
  changelog: {
    title: 'Changelog',
    category: 'Produk',
    date: 'Diperbarui: 1 Juni 2026',
    content: `### Versi 1.2.0 (Terbaru)
- **Fitur Baru:** Pipeline produk dengan status riset real-time (Pre-Clinical, Research, Special Order)
- **Fitur Baru:** Permintaan Certificate of Analysis (CoA) langsung dari portal
- **Perbaikan:** Performa halaman artikel dan detail studi klinis

### Versi 1.1.0
- **Fitur Baru:** Dukungan multibahasa — Bahasa Indonesia, Inggris, dan Mandarin
- **Fitur Baru:** Halaman artikel edukasi klinis untuk dokter dan tenaga medis
- **UI/UX:** Tampilan dark/light mode adaptif pada halaman publik

### Versi 1.0.0
- **Rilis:** Peluncuran portal Exomed Therapeutics Indonesia
- **Fitur Dasar:** Katalog produk, formulir konsultasi, dan halaman profil profesional`
  },
  roadmap: {
    title: 'Roadmap Pengembangan',
    category: 'Produk',
    date: 'Diperbarui: 1 Juni 2026',
    content: `### Q3 2026 (Sedang Berjalan)
- Sistem pemesanan produk online langsung melalui portal
- Dashboard laporan penggunaan dan riwayat pemesanan per klinik
- Integrasi notifikasi WhatsApp untuk update status pesanan

### Q4 2026
- Aplikasi mobile native (iOS & Android) untuk dokter mitra
- Modul edukasi klinis berbasis video dengan sertifikat CPD
- Ekspansi distribusi ke wilayah Kalimantan dan Sulawesi

### Q1 2027
- Program kemitraan klinik berjenjang (Silver, Gold, Platinum)
- Portal data studi observasional eksklusif untuk mitra terdaftar
- Penambahan lini produk platform Neurologis (EXOMED-CORD-NEURO)`
  },
  dokumentasi: {
    title: 'Pusat Dokumentasi',
    category: 'Support',
    date: 'Diperbarui: 1 Juni 2026',
    content: `Selamat datang di Pusat Dokumentasi Exomed Therapeutics Indonesia. Panduan lengkap untuk menggunakan portal dan mengakses layanan kami.

### 1. Registrasi Akun Profesional
Portal ini hanya dapat diakses oleh tenaga medis berlisensi. Daftarkan akun Anda dengan menyertakan nomor SIP/STR dan informasi klinik. Tim kami akan memverifikasi data dalam 1×24 jam kerja.

### 2. Mengajukan Permintaan CoA
Certificate of Analysis (CoA) tersedia untuk setiap batch produk. Untuk mengunduh CoA:
- Masuk ke portal dan buka menu Profil.
- Pilih "Permintaan CoA" dan isi formulir singkat.
- CoA akan dikirimkan ke email terdaftar Anda dalam waktu 1 jam.

### 3. Pemesanan Produk
Semua produk hanya tersedia melalui jalur distribusi resmi. Untuk melakukan pemesanan:
- Hubungi tim kami melalui formulir konsultasi atau WhatsApp.
- Tim Medical Representative akan menghubungi Anda untuk konfirmasi kebutuhan klinis dan proses order.
- **Catatan:** Produk dengan status Special Order memerlukan waktu pemrosesan tambahan.

### 4. Mengakses Artikel Klinis
Bagian Artikel menyediakan materi edukasi berbasis studi klinis dan data observasional. Beberapa artikel memerlukan akun Pro untuk akses penuh.`
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ)',
    category: 'Support',
    date: 'Diperbarui: 1 Juni 2026',
    content: `### Apa itu Exomed Therapeutics Indonesia?
Exomed Therapeutics Indonesia adalah subsidiary resmi dari Exomed Therapeutics USA, perusahaan bioteknologi berbasis di Florida. Kami adalah distributor eksklusif produk exosome terstandarisasi untuk dokter dan klinik profesional di Indonesia.

### Apa perbedaan exosome dengan stem cell konvensional?
Exosome adalah vesikel nanopartikel, bukan sel hidup. Keunggulan utamanya: tidak memerlukan donor autologus dari pasien, tidak mengekspresikan MHC class II sehingga risiko reaksi imunogenik sangat rendah, dan tersedia dalam formulasi siap pakai dengan standar konsisten di setiap batch.

### Siapa yang dapat memesan produk Exomed?
Produk kami hanya tersedia untuk tenaga medis berlisensi — dokter spesialis, dokter umum berpraktik, dan klinik profesional. Pembelian langsung oleh konsumen umum tidak tersedia.

### Apa saja lini produk yang tersedia?
Saat ini kami mendistribusikan dua lini utama: **Amniotic Platform** dan **Placental Platform**, dengan aplikasi klinis mencakup Ortopedi, Dermatologi, Estetika Medis, Restorasi Rambut, dan Sports Medicine. Beberapa produk tersedia sebagai Special Order.

### Apakah produk sudah tersertifikasi?
Ya. Seluruh produk diproduksi di fasilitas berlisensi FDA di Florida, USA, dengan standar FDA-Regulated Manufacturing. Certificate of Analysis (CoA) tersedia untuk setiap batch produk.

### Bagaimana cara memulai konsultasi?
Isi formulir konsultasi di halaman utama atau hubungi kami langsung via WhatsApp. Tim Medical Representative kami akan merespons dalam 1×24 jam kerja.`
  },
  status: {
    title: 'Status Sistem',
    category: 'Support',
    date: 'Real-time',
    content: `### Status Infrastruktur Inti
- **Server Utama (Portal):** 🟢 OPERATIONAL
- **Database:** 🟢 OPERATIONAL
- **Layanan Email & Notifikasi:** 🟢 OPERATIONAL

### Status Layanan Portal
- **Autentikasi & Akun:** 🟢 OPERATIONAL
- **Sistem Artikel & Konten:** 🟢 OPERATIONAL
- **Formulir Konsultasi:** 🟢 OPERATIONAL
- **Permintaan CoA:** 🟢 OPERATIONAL

Semua sistem Exomed Therapeutics Indonesia berjalan normal. Tidak ada gangguan yang dilaporkan saat ini.`
  },
  terms: {
    title: 'Syarat & Ketentuan',
    category: 'Legal',
    date: 'Berlaku Sejak: 1 Januari 2026',
    content: `Dengan mengakses dan menggunakan portal Exomed Therapeutics Indonesia, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan berikut.

### 1. Persyaratan Pengguna
Portal ini diperuntukkan khusus bagi tenaga medis berlisensi di Indonesia. Dengan mendaftar, Anda menyatakan bahwa informasi profesi yang Anda berikan adalah benar dan dapat diverifikasi. Exomed Therapeutics Indonesia berhak menonaktifkan akun yang tidak memenuhi persyaratan ini.

### 2. Penggunaan Konten
Seluruh konten pada portal ini — termasuk data klinis, artikel, dan informasi produk — merupakan milik Exomed Therapeutics Indonesia dan hanya boleh digunakan untuk keperluan klinis profesional. Reproduksi atau distribusi ulang tanpa izin tertulis dilarang.

### 3. Pemesanan & Distribusi
Semua transaksi pemesanan produk tunduk pada kebijakan distribusi yang berlaku. Exomed Therapeutics Indonesia berhak menolak pesanan yang tidak memenuhi syarat klinis atau persyaratan regulasi yang berlaku.

### 4. Ketersediaan Layanan
Kami berupaya menjaga ketersediaan portal 24/7, namun tidak menjamin bebas dari gangguan teknis atau pemeliharaan berkala. Pemberitahuan pemeliharaan terjadwal akan disampaikan terlebih dahulu.

### 5. Perubahan Syarat
Kami berhak memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan berlaku efektif sejak tanggal publikasi di halaman ini.`
  },
  privacy: {
    title: 'Kebijakan Privasi',
    category: 'Legal',
    date: 'Berlaku Sejak: 1 Januari 2026',
    content: `Exomed Therapeutics Indonesia ("kami") berkomitmen untuk melindungi privasi data seluruh pengguna terdaftar portal ini.

### 1. Data yang Dikumpulkan
Kami mengumpulkan data yang diperlukan untuk operasional layanan: nama lengkap, nomor SIP/STR, alamat email, nomor telepon, nama klinik/institusi, dan log aktivitas penggunaan portal untuk keperluan keamanan dan peningkatan layanan.

### 2. Penggunaan Data
Data Anda digunakan untuk: verifikasi akun profesional, pengiriman informasi produk dan update klinis yang relevan, komunikasi terkait pesanan dan konsultasi, serta peningkatan kualitas layanan portal.

### 3. Keamanan Data
Seluruh data disimpan dan dienkripsi menggunakan standar keamanan industri. Akses terhadap data pengguna dibatasi hanya pada personel yang berwenang dan memiliki kebutuhan operasional yang sah.

### 4. Pembagian Data
Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk keperluan komersial. Data hanya dapat dibagikan kepada mitra distribusi resmi Exomed untuk keperluan pemenuhan pesanan, atau kepada otoritas regulasi sesuai kewajiban hukum yang berlaku.

### 5. Hak Pengguna
Anda berhak mengakses, memperbarui, atau meminta penghapusan data pribadi Anda kapan saja melalui halaman Pengaturan Akun atau dengan menghubungi tim support kami.`
  },
  disclaimer: {
    title: 'Disclaimer',
    category: 'Legal',
    date: 'Berlaku Sejak: 1 Januari 2026',
    content: `### Penggunaan Profesional

Seluruh produk yang didistribusikan oleh Exomed Therapeutics Indonesia diperuntukkan khusus untuk penggunaan oleh tenaga medis berlisensi dalam setting klinis profesional. Produk ini **bukan** untuk penggunaan langsung oleh konsumen umum.

### Informasi Klinis

Data klinis, studi observasional, dan materi edukasi yang tersedia di portal ini disediakan semata-mata untuk tujuan referensi ilmiah dan edukasi profesional. Informasi ini tidak boleh ditafsirkan sebagai rekomendasi terapi tunggal atau panduan klinis yang menggantikan penilaian medis profesional.

**Keputusan terapi sepenuhnya berada pada diskresi dokter yang merawat** berdasarkan kondisi spesifik pasien, komorbiditas, dan standar praktik klinis yang berlaku.

### Hasil Klinis

Hasil yang dilaporkan dalam studi observasional dan data klinis yang tersedia di portal ini mencerminkan pengamatan pada populasi dan protokol spesifik. Hasil individual dapat bervariasi. Data historis tidak menjamin hasil serupa pada setiap pasien.

### Regulasi

Exomed Therapeutics Indonesia beroperasi sesuai regulasi distribusi alat kesehatan dan produk bioteknologi yang berlaku di Indonesia. Seluruh produk diproduksi di fasilitas berlisensi FDA di Florida, USA.`
  }
}

// Simple markdown parser for basic formatting without external libs
const SimpleMarkdown = ({ content }: { content: string }) => {
  const blocks = content.split('\n\n')
  
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) {
          return <h3 key={i} className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 tracking-tight">{block.replace('### ', '')}</h3>
        }
        
        // Check if block is a list
        if (block.includes('\n- ') || block.startsWith('- ')) {
          const lines = block.split('\n')
          // If first line isn't a list item, it's a paragraph before the list
          const hasIntro = !lines[0].startsWith('- ')
          
          return (
            <div key={i} className="space-y-3">
              {hasIntro && <p className="text-slate-300 leading-relaxed">{lines[0]}</p>}
              <ul className="space-y-3 pl-2">
                {lines.filter(l => l.startsWith('- ')).map((line, j) => {
                  // Basic bold parsing `**text**`
                  const parts = line.replace('- ', '').split(/(\*\*.*?\*\*)/)
                  return (
                    <li key={j} className="flex items-start gap-3 text-slate-300 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                      <div>
                        {parts.map((part, k) => 
                          part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={k} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        }

        // Regular paragraph with bold support
        const parts = block.split(/(\*\*.*?\*\*)/)
        return (
          <p key={i} className="text-slate-300 leading-relaxed md:text-lg">
            {parts.map((part, k) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={k} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function StaticPage() {
  const { slug } = useParams<{ slug: string }>()

  // Scroll to top on slug change
  useMemo(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const page = PAGE_CONTENT[slug || ''] || {
    title: 'Halaman Tidak Ditemukan',
    category: 'Error',
    date: '',
    content: 'Halaman yang Anda cari tidak tersedia atau sedang dalam perbaikan.'
  }

  // Group pages by category for sidebar
  const sidebarGroups = useMemo(() => {
    const groups: Record<string, { slug: string; title: string }[]> = {}
    Object.entries(PAGE_CONTENT).forEach(([key, val]) => {
      if (!groups[val.category]) groups[val.category] = []
      groups[val.category].push({ slug: key, title: val.title })
    })
    return groups
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-primary/30 selection:text-white">
      
      <Navbar />

      {/* ── HEADER BREADCRUMB ── */}
      <div className="pt-24 pb-6 border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 text-sm font-semibold">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-500">{page.category}</span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-primary truncate">{page.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-12 py-12">
        
        {/* ── SIDEBAR NAVIGATION ── */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            {Object.entries(sidebarGroups).map(([cat, items]) => (
              <div key={cat}>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2">{cat}</h4>
                <ul className="space-y-1">
                  {items.map(item => {
                    const isActive = slug === item.slug
                    const Icon = ICON_MAP[item.slug] || FileText
                    return (
                      <li key={item.slug}>
                        <Link 
                          to={`/page/${item.slug}`}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 max-w-3xl min-h-[60vh]">
          <motion.div 
            key={slug} 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            {/* Header Content */}
            <div className="mb-10 pb-8 border-b border-white/10 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 relative z-10">{page.title}</h1>
              {page.date && (
                <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> {page.date}
                </p>
              )}
            </div>

            {/* Markdown Body */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-6 md:p-10 shadow-xl">
              <SimpleMarkdown content={page.content} />
            </div>

            {/* Footer Content */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm text-slate-500 text-center sm:text-left max-w-sm">
                Tidak menemukan jawaban yang Anda cari? Tim support kami siap membantu 24/7.
              </p>
              <Link to="/support" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                Hubungi Support CS
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
