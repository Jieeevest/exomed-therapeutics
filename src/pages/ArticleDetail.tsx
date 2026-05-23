import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { useSessionGuard } from '@/hooks/useSessionGuard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CAT_COLORS: Record<string, string> = {
  news:     'text-blue-400 bg-blue-500/10 border-blue-500/20',
  tutorial: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  analysis: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  update:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}
const CAT_LABELS: Record<string, string> = {
  news: 'Berita', tutorial: 'Tutorial', analysis: 'Analisis', update: 'Update'
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  useSessionGuard()

  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/api/articles/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setArticle(data.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (notFound || !article) return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4">
        <BookOpen className="w-10 h-10 text-slate-600" />
      </div>
      <h1 className="text-4xl font-black tracking-tight">Artikel Tidak Ditemukan</h1>
      <p className="text-slate-500 max-w-sm">Mungkin artikel ini telah dihapus atau URL yang Anda masukkan salah.</p>
      <Link to="/articles" className="bg-primary text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]">
        Kembali ke Daftar Artikel
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-primary/30 selection:text-white">
      
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div className="pt-24 pb-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4 text-sm font-semibold">
          <Link to="/articles" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-slate-500 truncate">{article.title}</span>
        </div>
      </div>

      {/* ── ARTICLE CONTENT ── */}
      <motion.article
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 py-12 lg:py-20"
      >
        <header className="mb-12">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${CAT_COLORS[article.category] || 'bg-white/10 border-white/20 text-white'}`}>
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
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-[10px]">
                {article.author[0].toUpperCase()}
              </div>
              <span className="font-bold text-white">{article.author}</span>
            </div>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_url && (
          <div className="relative mb-16 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030303]/50 pointer-events-none" />
            <img src={article.cover_url} alt={article.title} className="w-full aspect-video object-cover" />
          </div>
        )}

        {/* Excerpt Summary */}
        {article.excerpt && (
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-6 md:p-8 rounded-r-3xl mb-12">
            <p className="text-lg md:text-xl text-white font-medium leading-relaxed">{article.excerpt}</p>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-primary/30 selection:text-white">
          {article.content}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/articles" className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center">
            <ArrowLeft className="w-4 h-4" /> Baca Artikel Lainnya
          </Link>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl w-full sm:w-auto text-center sm:text-left">
            <p className="text-sm text-slate-300 mb-1">Ada pertanyaan tentang fitur ini?</p>
            <Link to="/support" className="text-primary font-bold hover:underline">Hubungi Tim Support Kami →</Link>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
