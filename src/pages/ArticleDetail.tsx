import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, BookOpen } from 'lucide-react'

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
  const navigate = useNavigate()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
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
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (notFound || !article) return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center gap-4">
      <BookOpen className="w-16 h-16 text-slate-700" />
      <h1 className="text-2xl font-black">Artikel Tidak Ditemukan</h1>
      <Link to="/articles" className="text-primary hover:underline text-sm">Kembali ke Daftar Artikel</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Top Nav */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/articles')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-slate-400 text-sm truncate">{article.title}</span>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-6 py-12"
      >
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${CAT_COLORS[article.category] || ''}`}>
            {CAT_LABELS[article.category] || article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">{article.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Cover Image */}
        {article.cover_url && (
          <img src={article.cover_url} alt={article.title} className="w-full rounded-2xl mb-8 border border-white/5" />
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-slate-300 leading-relaxed mb-8 pl-4 border-l-2 border-primary/50">{article.excerpt}</p>
        )}

        {/* Content — rendered as plain text with whitespace preserved */}
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {article.content}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <Link to="/articles" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Semua Artikel
          </Link>
          <Link to="/support" className="text-sm text-primary hover:underline">Ada pertanyaan? Hubungi CS →</Link>
        </div>
      </motion.article>
    </div>
  )
}
