import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ArrowRight,
  Clock,
  Shield,
  Twitter,
  Github,
  Send,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Logo } from "@/components/Logo";

import { API_BASE } from "@/constants/apiUrls";
const API_URL = API_BASE;

const CATEGORIES = [
  { value: "", label: "Semua" },
  { value: "news", label: "Berita" },
  { value: "tutorial", label: "Tutorial" },
  { value: "analysis", label: "Analisis" },
  { value: "update", label: "Update" },
];

const CAT_COLORS: Record<string, string> = {
  news: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  tutorial: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  analysis: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  update: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [category, query]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (query) params.set("search", query);
      const res = await fetch(`${API_URL}/api/articles?${params}`);
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500/30 selection:text-white">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden pt-16 border-b border-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(180,120,30,0.15),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.1] text-slate-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> YourApp Content
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Artikel & <span className="text-gold-gradient">Konten</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Temukan artikel, tutorial, dan update terbaru dari tim kami. Semua
              konten dikurasi untuk membantu Anda memaksimalkan platform.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex gap-2 max-w-xl mx-auto relative group"
            >
              <div className="absolute -inset-0.5 bg-gold-gradient rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari artikel, tutorial, atau update..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-l-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors text-white placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gold-gradient text-white font-bold rounded-r-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Cari
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-12 justify-center">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setCategory(c.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                category === c.value
                  ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(78,130,129,0.3)]"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>

        {/* Loading / Empty / Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">
              Memuat intelijen pasar...
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-[#0a0a0a]">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Kami tidak menemukan artikel yang cocok dengan kata kunci atau
              kategori yang Anda pilih.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-[#0a0a0a] border border-white/10 hover:border-amber-500/40 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
              >
                {a.cover_url ? (
                  <div className="relative h-56 overflow-hidden bg-white/5">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img
                      src={a.cover_url}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,130,129,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <BookOpen className="w-12 h-12 text-white/20 group-hover:scale-110 group-hover:text-amber-500/40 transition-all duration-500" />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1 relative z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${CAT_COLORS[a.category] || "bg-white/10 border-white/20 text-white"}`}
                    >
                      {CATEGORIES.find((c) => c.value === a.category)?.label ||
                        a.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(
                        a.published_at || a.created_at,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {a.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                    {a.excerpt || a.content.substring(0, 150) + "..."}
                  </p>

                  <Link
                    to={`/articles/${a.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors mt-auto group/btn"
                  >
                    Baca Artikel{" "}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-16 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <Logo variant="horizontal" className="h-16 w-auto" />
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-xs">
                Boilerplate aplikasi SaaS modern dengan design system premium,
                autentikasi lengkap, dan admin panel siap pakai.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Alamat perusahaan Anda,
                    <br />
                    Kota, Provinsi, Kode Pos
                  </p>
                </div>
                <a
                  href="mailto:hello@yourapp.id"
                  className="flex items-center gap-2.5 group"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-slate-500 text-xs group-hover:text-amber-400 transition-colors">
                    hello@yourapp.id
                  </span>
                </a>
                <a
                  href="tel:+6200000000000"
                  className="flex items-center gap-2.5 group"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-slate-500 text-xs group-hover:text-amber-400 transition-colors">
                    +62 000-0000-0000
                  </span>
                </a>
              </div>
              <div className="flex gap-3">
                {[Twitter, Github, Send].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: "Produk",
                links: [
                  { name: "Fitur", url: "/#fitur" },
                  { name: "Cara Kerja", url: "/#cara-kerja" },
                  { name: "Harga", url: "/#harga" },
                  { name: "Roadmap", url: "/page/roadmap" },
                ],
              },
              {
                title: "Support",
                links: [
                  { name: "Dokumentasi", url: "/page/dokumentasi" },
                  { name: "FAQ", url: "/page/faq" },
                  { name: "Status", url: "/page/status" },
                  { name: "Kontak CS", url: "/support" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Syarat & Ketentuan", url: "/page/terms" },
                  { name: "Kebijakan Privasi", url: "/page/privacy" },
                  { name: "Disclaimer Risiko", url: "/page/disclaimer" },
                  // { name: 'Metodologi', url: '/page/methodology' }
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      {l.url.startsWith("/#") ? (
                        <a
                          href={l.url}
                          className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          {l.name}
                        </a>
                      ) : (
                        <Link
                          to={l.url}
                          className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          {l.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} YourApp. Seluruh hak cipta dilindungi
              undang-undang.
            </p>
            <div className="flex gap-4">
              <Link
                to="/page/terms"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/page/privacy"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/page/disclaimer"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
