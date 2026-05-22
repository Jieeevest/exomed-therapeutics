import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Search, ArrowRight, Clock, } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CATEGORIES = [
  { value: '',          label: 'Semua' },
  { value: 'news',      label: 'Berita' },
  { value: 'tutorial',  label: 'Tutorial' },
  { value: 'analysis',  label: 'Analisis' },
  { value: 'update',    label: 'Update' },
]

const CAT_COLORS: Record<string, string> = {
  news:     'text-blue-400 bg-blue-500/10 border-blue-500/20',
  tutorial: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  analysis: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  update:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}

export default function Articles() {
    const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => { fetchArticles() }, [category, query])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (query)    params.set('search', query)
      const res = await fetch(`${API_URL}/api/articles?${params}`)
      const data = await res.json()
      if (data.success) setArticles(data.data)
    } catch {} finally { setLoading(false) }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search)
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" /> KNOWLEDGE BASE
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Artikel & Panduan</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">Tutorial, analisis pasar, dan update terbaru dari tim CryptoEx untuk para trader profesional.</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari artikel..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-primary text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">Cari</button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${category === c.value ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada artikel yang tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {/* Featured first */}
            {articles[0] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/articles/${articles[0].slug}`}
                  className="group block bg-gradient-to-br from-primary/10 to-blue-900/10 border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${CAT_COLORS[articles[0].category] || ''}`}>
                      {CATEGORIES.find(c => c.value === articles[0].category)?.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(articles[0].published_at || articles[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-white group-hover:text-primary transition-colors mb-2">{articles[0].title}</h2>
                  {articles[0].excerpt && <p className="text-slate-400 text-sm line-clamp-2 mb-4">{articles[0].excerpt}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">oleh <span className="text-slate-300">{articles[0].author}</span></span>
                    <span className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">Baca <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Rest in grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {articles.slice(1).map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/articles/${a.slug}`}
                    className="group block bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-colors h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CAT_COLORS[a.category] || ''}`}>
                        {CATEGORIES.find(c => c.value === a.category)?.label}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {new Date(a.published_at || a.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{a.title}</h3>
                    {a.excerpt && <p className="text-slate-500 text-xs line-clamp-2">{a.excerpt}</p>}
                    <div className="mt-3 text-xs text-slate-600">oleh {a.author}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
