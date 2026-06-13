import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
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

const CAT_COLORS: Record<string, string> = {
  news: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  tutorial: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  analysis: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  update: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};
const CAT_LABELS: Record<string, string> = {
  news: "Berita",
  tutorial: "Tutorial",
  analysis: "Analisis",
  update: "Update",
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/articles/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticle(data.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );

  if (notFound || !article)
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-slate-600" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-slate-500 max-w-sm">
          Mungkin artikel ini telah dihapus atau URL yang Anda masukkan salah.
        </p>
        <Link
          to="/articles"
          className="bg-gold-gradient text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(78,130,129,0.2)]"
        >
          Kembali ke Daftar Riset
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500/30 selection:text-white">
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="pt-24 pb-6 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4 text-sm font-semibold">
          <Link
            to="/articles"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-slate-500 truncate">{article.title}</span>
        </div>
      </div>

      {/* ── ARTICLE CONTENT ── */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 py-12 lg:py-20"
      >
        <header className="mb-12">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${CAT_COLORS[article.category] || "bg-white/10 border-white/20 text-white"}`}
            >
              {CAT_LABELS[article.category] || article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center text-black font-bold text-[10px]">
                {article.author[0].toUpperCase()}
              </div>
              <span className="font-bold text-white">{article.author}</span>
            </div>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              {new Date(
                article.published_at || article.created_at,
              ).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_url && (
          <div className="relative mb-16 rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030303]/50 pointer-events-none" />
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Excerpt Summary */}
        {article.excerpt && (
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-6 md:p-8 rounded-r-3xl mb-12">
            <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30 selection:text-white">
          {article.content}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/articles"
            className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Baca Artikel Lainnya
          </Link>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl w-full sm:w-auto text-center sm:text-left">
            <p className="text-sm text-slate-300 mb-1">
              Ada pertanyaan mengenai artikel ini?
            </p>
            <Link
              to="/support"
              className="text-amber-400 font-bold hover:underline"
            >
              Hubungi Tim Support Kami →
            </Link>
          </div>
        </div>
      </motion.article>

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
