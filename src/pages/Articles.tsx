import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Search, ArrowRight, Clock, Shield } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { useSessionGuard } from '@/hooks/useSessionGuard'

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
  useSessionGuard()
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
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-primary/30 selection:text-white">
      
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden pt-16 border-b border-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(120,80,255,0.15),transparent)]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.1] text-slate-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-primary" /> CryptoEx Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Insight Pasar <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Pro</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Analisis mendalam, tutorial teknikal, dan update market real-time langsung dari meja trader institusional kami.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  value={search} onChange={e => setSearch(e.target.value)} 
                  placeholder="Cari analisis, token, atau tutorial..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-l-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-slate-600" 
                />
                <button type="submit" className="px-8 py-4 bg-white text-black font-bold rounded-r-xl text-sm hover:bg-slate-200 transition-colors">
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
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setCategory(c.value)}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                category === c.value 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-32 flex justify-center">
            <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="py-32 text-center border border-white/5 rounded-3xl bg-white/[0.01]">
            <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Belum ada intelijen pasar untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Featured Article */}
            {articles[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/articles/${articles[0].slug}`}
                  className="group relative block rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-white/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="md:flex">
                    {articles[0].cover_url && (
                      <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                        <img src={articles[0].cover_url} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                      </div>
                    )}
                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${CAT_COLORS[articles[0].category] || 'bg-white/10 border-white/20'}`}>
                          {CATEGORIES.find(c => c.value === articles[0].category)?.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(articles[0].published_at || articles[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <h2 className="text-3xl font-black text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 group-hover:bg-clip-text group-hover:text-transparent transition-all mb-4">
                        {articles[0].title}
                      </h2>
                      {articles[0].excerpt && <p className="text-slate-400 text-sm md:text-base line-clamp-3 mb-8 leading-relaxed">{articles[0].excerpt}</p>}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BY <span className="text-white">{articles[0].author}</span></span>
                        <span className="flex items-center gap-2 text-white font-bold group-hover:text-primary transition-colors">
                          BACA SELENGKAPNYA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid Articles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                  <Link to={`/articles/${a.slug}`}
                    className="group block h-full bg-[#0a0a0a] border border-white/10 hover:border-white/30 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${CAT_COLORS[a.category] || 'bg-white/10 border-white/20'}`}>
                        {CATEGORIES.find(c => c.value === a.category)?.label}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-3 group-hover:text-primary transition-colors">{a.title}</h3>
                    {a.excerpt && <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{a.excerpt}</p>}
                    
                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {new Date(a.published_at || a.created_at).toLocaleDateString('id-ID')} &bull; {a.author}
                      </span>
                    </div>
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
