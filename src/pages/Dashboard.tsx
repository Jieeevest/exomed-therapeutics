import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { BookOpen, Clock, BarChart2, LayoutGrid, Square, Plus, Scan, LogOut, ShieldAlert, User, Crown, Ticket } from 'lucide-react'

import { useAuth } from '@/store/useAuth'
import { ProGate } from '@/components/ProGate'
import { CoinList } from '@/components/CoinList'
import { TradingChart } from '@/components/TradingChart'
import { DashboardGrid } from '@/components/DashboardGrid'
import { OrderBook } from '@/components/OrderBook'
import { TradeHistory } from '@/components/TradeHistory'
import { SignalPanel } from '@/components/SignalPanel'
// import { BacktestPanel } from '@/components/BacktestPanel'
import { BullishWatchlist } from '@/components/BullishWatchlist'

// Spot hooks
import { useBinanceTickers, useBinanceOrderBook, useBinanceTrades, useBinancePrice } from '@/hooks/useBinance'
import { useCryptoComTickers, useCryptoComOrderBook, useCryptoComTrades } from '@/hooks/useCryptoCom'
import { useKuCoinTickers, useKuCoinOrderBook, useKuCoinTrades } from '@/hooks/useKuCoin'
import { useOKXTickers, useOKXOrderBook, useOKXTrades } from '@/hooks/useOKX'

// Futures hooks
import { useBinanceFutureTickers, useBinanceFutureOrderBook, useBinanceFutureTrades, useBinanceFuturePrice } from '@/hooks/useBinanceFutures'
import { useCryptoComFutureTickers, useCryptoComFutureOrderBook, useCryptoComFutureTrades } from '@/hooks/useCryptoComFutures'
import { useKuCoinFutureTickers, useKuCoinFutureOrderBook, useKuCoinFutureTrades } from '@/hooks/useKuCoinFutures'
import { useOKXFutureTickers, useOKXFutureOrderBook, useOKXFutureTrades } from '@/hooks/useOKXFutures'

import { FuturesOpportunitiesPanel } from '@/components/FuturesOpportunitiesPanel'

// 2. Ubah type RightTab
type RightTab = 'orderbook' | 'trades' | 'signal' | 'backtest' | 'scanner' | 'opportunities'

import type { Ticker, Exchange, MarketType } from '@/types'
import { cn } from '@/lib/utils'
import { getTVSources } from '@/lib/tvSymbol'
import { useSessionGuard } from '@/hooks/useSessionGuard'
import { Logo } from '@/components/Logo'


const EXCHANGES: { id: Exchange; label: string; color: string }[] = [
  { id: 'binance', label: 'Binance', color: '#F0B90B' },
  { id: 'cryptocom', label: 'Crypto.com', color: '#1199FA' },
  { id: 'kucoin', label: 'KuCoin', color: '#23AF91' },
  { id: 'okx', label: 'OKX', color: '#A0A0A0' },
]

const DEFAULT_SPOT_SYMBOLS: Record<Exchange, string> = {
  binance: 'BTCUSDT',
  cryptocom: 'BTC_USDT',
  kucoin: 'BTC-USDT',
  okx: 'BTC-USDT',
}

const DEFAULT_FUTURES_SYMBOLS: Record<Exchange, string> = {
  binance: 'BTCUSDT',
  cryptocom: 'BTCUSD-PERP',
  kucoin: 'XBTUSDTM',
  okx: 'BTC-USDT-SWAP',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useSessionGuard()
  
  const [exchange, setExchange] = useState<Exchange>('binance')
  const [marketType, setMarketType] = useState<MarketType>('spot')
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null)
  const [symbol, setSymbol] = useState(DEFAULT_SPOT_SYMBOLS.binance)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [rightTab, setRightTab] = useState<RightTab>('orderbook')
  const [tvSourceIdx, setTvSourceIdx] = useState(0)
  const [chartMode, setChartMode] = useState<'single' | 'grid'>('single')
  const [gridSymbols, setGridSymbols] = useState<{ symbol: string; tvSymbol: string }[]>([])
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  // ── Spot data ──────────────────────────────────────────────
  const { tickers: binanceSpotTickers, loading: binanceSpotLoading } = useBinanceTickers()
  const binanceSpotOB = useBinanceOrderBook(exchange === 'binance' && marketType === 'spot' ? symbol : '')
  const binanceSpotTrades = useBinanceTrades(exchange === 'binance' && marketType === 'spot' ? symbol : '')
  useBinancePrice(exchange === 'binance' && marketType === 'spot' ? symbol : '', setCurrentPrice)

  const { tickers: cryptoComSpotTickers, loading: cryptoComSpotLoading } = useCryptoComTickers()
  const cryptoComSpotOB = useCryptoComOrderBook(exchange === 'cryptocom' && marketType === 'spot' ? symbol : '')
  const cryptoComSpotTrades = useCryptoComTrades(exchange === 'cryptocom' && marketType === 'spot' ? symbol : '')

  const { tickers: kucoinSpotTickers, loading: kucoinSpotLoading } = useKuCoinTickers()
  const kucoinSpotOB = useKuCoinOrderBook(exchange === 'kucoin' && marketType === 'spot' ? symbol : '')
  const kucoinSpotTrades = useKuCoinTrades(exchange === 'kucoin' && marketType === 'spot' ? symbol : '')

  const { tickers: okxSpotTickers, loading: okxSpotLoading } = useOKXTickers()
  const okxSpotOB = useOKXOrderBook(exchange === 'okx' && marketType === 'spot' ? symbol : '')
  const okxSpotTrades = useOKXTrades(exchange === 'okx' && marketType === 'spot' ? symbol : '')

  // ── Futures data ───────────────────────────────────────────
  const { tickers: binanceFutTickers, loading: binanceFutLoading } = useBinanceFutureTickers()
  const binanceFutOB = useBinanceFutureOrderBook(exchange === 'binance' && marketType === 'futures' ? symbol : '')
  const binanceFutTrades = useBinanceFutureTrades(exchange === 'binance' && marketType === 'futures' ? symbol : '')
  useBinanceFuturePrice(exchange === 'binance' && marketType === 'futures' ? symbol : '', setCurrentPrice)

  const { tickers: cryptoComFutTickers, loading: cryptoComFutLoading } = useCryptoComFutureTickers()
  const cryptoComFutOB = useCryptoComFutureOrderBook(exchange === 'cryptocom' && marketType === 'futures' ? symbol : '')
  const cryptoComFutTrades = useCryptoComFutureTrades(exchange === 'cryptocom' && marketType === 'futures' ? symbol : '')

  const { tickers: kucoinFutTickers, loading: kucoinFutLoading } = useKuCoinFutureTickers()
  const kucoinFutOB = useKuCoinFutureOrderBook(exchange === 'kucoin' && marketType === 'futures' ? symbol : '')
  const kucoinFutTrades = useKuCoinFutureTrades(exchange === 'kucoin' && marketType === 'futures' ? symbol : '')

  const { tickers: okxFutTickers, loading: okxFutLoading } = useOKXFutureTickers()
  const okxFutOB = useOKXFutureOrderBook(exchange === 'okx' && marketType === 'futures' ? symbol : '')
  const okxFutTrades = useOKXFutureTrades(exchange === 'okx' && marketType === 'futures' ? symbol : '')

  // ── Active data selectors ─────────────────────────────────
  const activeTickers = marketType === 'spot'
    ? { binance: binanceSpotTickers, cryptocom: cryptoComSpotTickers, kucoin: kucoinSpotTickers, okx: okxSpotTickers }[exchange]
    : { binance: binanceFutTickers, cryptocom: cryptoComFutTickers, kucoin: kucoinFutTickers, okx: okxFutTickers }[exchange]

  const activeLoading = marketType === 'spot'
    ? { binance: binanceSpotLoading, cryptocom: cryptoComSpotLoading, kucoin: kucoinSpotLoading, okx: okxSpotLoading }[exchange]
    : { binance: binanceFutLoading, cryptocom: cryptoComFutLoading, kucoin: kucoinFutLoading, okx: okxFutLoading }[exchange]

  const activeOrderBook = marketType === 'spot'
    ? { binance: binanceSpotOB, cryptocom: cryptoComSpotOB, kucoin: kucoinSpotOB, okx: okxSpotOB }[exchange]
    : { binance: binanceFutOB, cryptocom: cryptoComFutOB, kucoin: kucoinFutOB, okx: okxFutOB }[exchange]

  const activeTrades = marketType === 'spot'
    ? { binance: binanceSpotTrades, cryptocom: cryptoComSpotTrades, kucoin: kucoinSpotTrades, okx: okxSpotTrades }[exchange]
    : { binance: binanceFutTrades, cryptocom: cryptoComFutTrades, kucoin: kucoinFutTrades, okx: okxFutTrades }[exchange]

  // Sync price from ticker list for non-WS exchanges
  useEffect(() => {
    if ((exchange !== 'binance' || marketType !== 'spot') && selectedTicker) {
      const updated = activeTickers.find((t) => t.symbol === selectedTicker.symbol)
      if (updated) setCurrentPrice(updated.price)
    }
  }, [activeTickers])

  const handleExchangeChange = (ex: Exchange) => {
    setExchange(ex)
    const sym = marketType === 'spot' ? DEFAULT_SPOT_SYMBOLS[ex] : DEFAULT_FUTURES_SYMBOLS[ex]
    setSymbol(sym)
    setSelectedTicker(null)
    setCurrentPrice(0)
    setTvSourceIdx(0)
  }

const handleMarketTypeChange = (mt: MarketType) => {
  setMarketType(mt)
  const sym = mt === 'spot' ? DEFAULT_SPOT_SYMBOLS[exchange] : DEFAULT_FUTURES_SYMBOLS[exchange]
  setSymbol(sym)
  setSelectedTicker(null)
  setCurrentPrice(0)
  setTvSourceIdx(0)
}
  const handleSelectCoin = (ticker: Ticker) => {
    setSelectedTicker(ticker)
    setSymbol(ticker.symbol)
    setCurrentPrice(ticker.price)
    setTvSourceIdx(0)
    setChartMode('single')
  }


  const activeExchangeInfo = EXCHANGES.find((e) => e.id === exchange)!
  const isFutures = marketType === 'futures'

  const tvSources = getTVSources(symbol, exchange, marketType)
  const activeTvSource = tvSources[tvSourceIdx % tvSources.length]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 mr-1">
          <Logo className="h-8 w-auto" variant='horizontal'/>
          {/* <span className="font-bold text-foreground text-sm">CryptoEx</span> */}
        </div>

        {/* Spot / Futures toggle */}
        <div className="flex rounded-md overflow-hidden border border-border">
          {(['spot', 'futures'] as MarketType[]).map((mt) => (
            <motion.button
              key={mt}
              onClick={() => handleMarketTypeChange(mt)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold transition-colors',
                marketType === mt
                  ? mt === 'spot'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              whileTap={{ scale: 0.96 }}
            >
              {mt === 'spot' ? 'Spot' : 'Futures'}
            </motion.button>
          ))}
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Chart Mode toggle */}
        <div className="flex rounded-md overflow-hidden border border-border">
          <motion.button
            onClick={() => setChartMode('single')}
            className={cn(
              'px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors',
              chartMode === 'single'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
            whileTap={{ scale: 0.96 }}
          >
            <Square className="h-3.5 w-3.5" />
            Single
          </motion.button>
          <motion.button
            onClick={() => user?.subscription_tier === 'pro' ? setChartMode('grid') : null}
            className={cn(
              'px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors',
              chartMode === 'grid'
                ? 'bg-primary/20 text-primary'
                : user?.subscription_tier === 'pro'
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  : 'text-muted-foreground/40 cursor-not-allowed'
            )}
            whileTap={{ scale: user?.subscription_tier === 'pro' ? 0.96 : 1 }}
            title={user?.subscription_tier !== 'pro' ? 'Fitur PRO — Upgrade untuk Grid Mode' : undefined}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
            {user?.subscription_tier !== 'pro' && <Crown className="h-2.5 w-2.5 text-yellow-500" />}
          </motion.button>
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Exchange tabs */}
        <div className="flex gap-1">
          {EXCHANGES.map((ex) => (
            <motion.button
              key={ex.id}
              onClick={() => handleExchangeChange(ex.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                exchange === ex.id
                  ? 'bg-muted text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              whileTap={{ scale: 0.96 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: ex.color, opacity: exchange === ex.id ? 1 : 0.5 }}
              />
              {ex.label}
            </motion.button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Market type badge */}
        <div className={cn(
          'text-[10px] px-2 py-0.5 rounded font-semibold hidden md:block',
          isFutures ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        )}>
          {isFutures ? 'PERPETUAL' : 'SPOT'}
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground mr-4">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>

        <button 
          onClick={() => navigate('/support')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md border border-primary/20 mr-2"
        >
          <Ticket className="w-3.5 h-3.5" /> Support CS
        </button>

        <div className="w-px h-4 bg-border mr-2" />

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none">
              <span className="text-xs font-bold text-white mb-0.5">{user?.username || 'Trader'}</span>
              <span className={cn(
                "text-[9px] font-bold tracking-wider uppercase",
                user?.subscription_tier === 'pro' ? 'text-purple-400' : 'text-slate-500'
              )}>
                {user?.subscription_tier || 'STARTER'}
              </span>
            </div>
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-white/5 mb-1">
                  <div className="text-sm font-semibold text-white truncate">{user?.username}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>

                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <ShieldAlert className="w-4 h-4" /> Admin Panel
                  </button>
                )}
                
                <button onClick={() => navigate('/articles')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <BookOpen className="w-4 h-4" /> Artikel & Berita
                </button>

                <button onClick={() => navigate('/support')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <Ticket className="w-4 h-4" /> Support Tickets
                </button>
                
                <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> Subscription Info
                </button>
                
                <div className="h-px bg-white/5 my-1" />
                
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main layout */}
      <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">

        {/* LEFT — Coin list */}
        <Panel defaultSize="20" minSize="15" maxSize="30" className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${exchange}-${marketType}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
            <div
              className="px-3 py-1.5 text-[10px] font-semibold border-b border-border flex items-center justify-between"
            >
              <span style={{ color: activeExchangeInfo.color }}>
                {activeExchangeInfo.label}
              </span>
              <span className={cn(
                'text-[9px] px-1.5 py-0.5 rounded',
                isFutures ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
              )}>
                {isFutures ? 'Futures' : 'Spot'} · {activeTickers.length}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CoinList
                tickers={activeTickers}
                loading={activeLoading}
                selectedSymbol={symbol}
                exchange={exchange}
                marketType={marketType}
                onSelect={handleSelectCoin}
              />
            </div>
          </motion.div>
          </AnimatePresence>
        </Panel>

        <PanelResizeHandle className="w-2 mx-[-1px] z-10 flex items-center justify-center cursor-col-resize group bg-transparent">
          <div className="w-[1px] h-full bg-border group-hover:bg-primary transition-colors" />
        </PanelResizeHandle>

        {/* CENTER — Chart / Grid */}
        <Panel defaultSize="55" minSize="30" className="flex flex-col overflow-hidden">
          {chartMode === 'grid' ? (
            <DashboardGrid 
              items={gridSymbols} 
              onRemove={(sym) => setGridSymbols(prev => prev.filter(p => p.symbol !== sym))} 
            />
          ) : (
            <>
              {/* Symbol bar */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">
                    {selectedTicker?.baseAsset ?? 'BTC'}/{isFutures ? 'PERP' : 'USDT'}
                  </span>
                  {isFutures && (
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono">
                      {exchange === 'binance' ? 'PERP' : exchange === 'okx' ? 'SWAP' : 'PERP'}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{activeExchangeInfo.label}</span>
                </div>
                {selectedTicker && (
                  <>
                    <span className={cn(
                      'text-sm font-bold font-mono',
                      selectedTicker.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {currentPrice.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                    </span>
                    <span className={cn('text-xs', selectedTicker.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {selectedTicker.priceChangePercent >= 0 ? '+' : ''}{selectedTicker.priceChangePercent.toFixed(2)}%
                    </span>
                    
                    <button
                      onClick={() => {
                        if (!gridSymbols.find(g => g.symbol === selectedTicker.symbol) && gridSymbols.length < 9) {
                          setGridSymbols(prev => [...prev, { symbol: selectedTicker.symbol, tvSymbol: activeTvSource.symbol }])
                        }
                        setChartMode('grid')
                      }}
                      className="ml-2 px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded hover:bg-primary/20 transition-colors flex items-center gap-1"
                      title="Tambahkan ke Dashboard Grid"
                    >
                      <Plus className="h-3 w-3" />
                      Grid
                    </button>

                    <div className="flex gap-4 text-[10px] text-muted-foreground ml-auto">
                      {isFutures && selectedTicker.markPrice && (
                        <span>Mark: {selectedTicker.markPrice.toFixed(4)}</span>
                      )}
                      <span>H: {selectedTicker.high24h.toFixed(4)}</span>
                      <span>L: {selectedTicker.low24h.toFixed(4)}</span>
                      {isFutures && selectedTicker.fundingRate !== undefined ? (
                        <span className={selectedTicker.fundingRate >= 0 ? 'text-green-400' : 'text-red-400'}>
                          Fund: {selectedTicker.fundingRate >= 0 ? '+' : ''}{selectedTicker.fundingRate.toFixed(4)}%
                        </span>
                      ) : (
                        <span>Vol: {(selectedTicker.volume / 1_000_000).toFixed(2)}M</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* TradingView source selector */}
              <div className="flex items-center gap-2 px-3 py-1 border-b border-border bg-muted/30 shrink-0">
                <span className="text-[10px] text-muted-foreground">Chart sumber:</span>
                <div className="flex gap-1">
                  {tvSources.map((src, i) => (
                    <button
                      key={src.symbol}
                      onClick={() => setTvSourceIdx(i)}
                      className={cn(
                        'px-2 py-0.5 text-[10px] rounded transition-colors',
                        i === tvSourceIdx % tvSources.length
                          ? 'bg-primary/20 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground ml-auto font-mono opacity-60">
                  {activeTvSource.symbol}
                </span>
              </div>

              {/* TradingView chart */}
              <div className="flex-1 overflow-hidden">
                <TradingChart tvSymbol={activeTvSource.symbol} />
              </div>
            </>
          )}
        </Panel>

        <PanelResizeHandle className="w-2 mx-[-1px] z-10 flex items-center justify-center cursor-col-resize group bg-transparent">
          <div className="w-[1px] h-full bg-border group-hover:bg-primary transition-colors" />
        </PanelResizeHandle>

        {/* RIGHT — Tabs + panels */}
        <Panel defaultSize="25" minSize="20" maxSize="40" className="flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
           {([
  { id: 'orderbook', icon: <BookOpen className="h-3 w-3" />,        label: 'Book',     pro: false },
  { id: 'trades',    icon: <Clock className="h-3 w-3" />,           label: 'Trades',   pro: false },
  { id: 'signal',    icon: <BarChart2 className="h-3 w-3" />,       label: 'Analisa',  pro: true },
  // { id: 'backtest',  icon: <FlaskConical className="h-3 w-3" />,    label: 'Backtest', pro: true },
  { id: 'scanner',   icon: <Scan className="h-3 w-3" />,            label: 'Scanner',  pro: true },
] as { id: RightTab; icon: React.ReactNode; label: string; pro: boolean }[])
  .map((tab) => (
    <button
      key={tab.id}
      onClick={() => setRightTab(tab.id)}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors relative',
        rightTab === tab.id
          ? tab.id === 'signal'
            ? 'text-primary border-b-2 border-primary'
            : 'text-foreground border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {tab.icon}
      {tab.label}
      {tab.pro && user?.subscription_tier !== 'pro' && (
        <Crown className="h-2 w-2 text-yellow-500 absolute top-1 right-1" />
      )}
    </button>
  ))}
          </div>

          {/* Signal / Backtest / Scanner — PRO only */}
          {rightTab === 'signal' ? (
            <div className="flex-1 overflow-hidden">
              <ProGate feature={isFutures ? "Futures Long/Short Opportunities" : "Panel Sinyal Trading"}>
                {isFutures ? (
                  <FuturesOpportunitiesPanel
                    tickers={activeTickers}
                    exchange={exchange}
                    active={rightTab === 'signal'}
                    onSelectCoin={handleSelectCoin}
                  />
                ) : (
                  <SignalPanel
                    ticker={selectedTicker}
                    exchange={exchange}
                    marketType={marketType}
                    currentPrice={currentPrice}
                  />
                )}
              </ProGate>
            </div>
          // ) : rightTab === 'backtest' ? (
          //   <div className="flex-1 overflow-hidden">
          //     <ProGate feature="Backtest Strategi">
          //       <BacktestPanel ticker={selectedTicker} exchange={exchange} marketType={marketType} />
          //     </ProGate>
          //   </div>
          ) : rightTab === 'scanner' ? (
            <div className="flex-1 overflow-hidden">
              <ProGate feature="Bullish Scanner">
                <BullishWatchlist 
                  tickers={activeTickers} 
                  exchange={exchange} 
                  marketType={marketType} 
                  onSelectCoin={handleSelectCoin} 
                />
              </ProGate>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {rightTab === 'orderbook' ? (
                  <motion.div key="ob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <OrderBook
                      orderBook={activeOrderBook}
                      currentPrice={currentPrice}
                      onPriceClick={() => {}}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="trades" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <TradeHistory trades={activeTrades} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Panel>
      </PanelGroup>
    </div>
  )
}
