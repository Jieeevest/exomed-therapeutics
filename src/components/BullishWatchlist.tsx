import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, X, TrendingUp, TrendingDown, Minus, RefreshCw, Clock, Filter } from 'lucide-react'
import type { Ticker, Exchange, MarketType } from '@/types'
import { useBullishScanner, type ScanResult } from '@/hooks/useBullishScanner'
import type { BullishLabel } from '@/lib/signals'
import { cn } from '@/lib/utils'

interface Props {
  tickers: Ticker[]
  exchange: Exchange
  marketType: MarketType
  onSelectCoin: (ticker: Ticker) => void
}

// ── Label styling ───────────────────────────────────────────────────────────
const LABEL_CFG: Record<BullishLabel, { color: string; bg: string; icon: React.ReactNode }> = {
  'Bullish':      { color: 'text-green-400',  bg: 'bg-green-500/15',   icon: <TrendingUp className="h-3 w-3" /> },
  'Mild Bullish': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <TrendingUp className="h-3 w-3" /> },
  'Neutral':      { color: 'text-yellow-400', bg: 'bg-yellow-500/10',  icon: <Minus className="h-3 w-3" /> },
  'Mild Bearish': { color: 'text-orange-400', bg: 'bg-orange-500/10',  icon: <TrendingDown className="h-3 w-3" /> },
  'Bearish':      { color: 'text-red-400',    bg: 'bg-red-500/15',     icon: <TrendingDown className="h-3 w-3" /> },
}

const THRESHOLD_OPTIONS = [
  { label: 'Semua',   value: 0   },
  { label: '≥ 55%',   value: 55  },
  { label: '≥ 60%',   value: 60  },
  { label: '≥ 65%',   value: 65  },
]

// ── Mini gauge bar ────────────────────────────────────────────────────────
function PctBar({ pct }: { pct: number }) {
  const color =
    pct >= 65 ? 'bg-green-500' :
    pct >= 55 ? 'bg-emerald-500' :
    pct >= 45 ? 'bg-yellow-500' :
    pct >= 35 ? 'bg-orange-500' :
    'bg-red-500'
  return (
    <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── Single result row ─────────────────────────────────────────────────────
function ResultRow({ result, rank, onClick }: {
  result: ScanResult
  rank: number
  onClick: () => void
}) {
  const { ticker, signal } = result
  const cfg = LABEL_CFG[signal.label]
  const pctColor = ticker.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full flex flex-col gap-1 px-3 py-2.5 border-b border-border/50 hover:bg-muted/30 text-left transition-colors"
    >
      {/* Row 1: rank + symbol + label + pct */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-4 shrink-0 font-mono">{rank}</span>
        <span className="font-bold text-xs text-foreground flex-1 truncate flex items-center gap-1">
          {ticker.baseAsset}
          <span className="text-muted-foreground font-normal">/USDT</span>
          {signal.trend === 'Uptrend' && <TrendingUp className="h-3 w-3 text-green-400 ml-0.5" />}
          {signal.trend === 'Downtrend' && <TrendingDown className="h-3 w-3 text-red-400 ml-0.5" />}
        </span>
        <div className={cn('flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-semibold', cfg.bg, cfg.color)}>
          {cfg.icon}
          {signal.label}
        </div>
      </div>

      {/* Row 2: gauge bar + bullish pct + 24h change */}
      <div className="flex items-center gap-2 pl-6">
        <div className="flex-1">
          <PctBar pct={signal.bullishPct} />
        </div>
        <span className="text-[11px] font-mono font-bold text-foreground w-10 text-right">
          {signal.bullishPct.toFixed(1)}%
        </span>
        <span className={cn('text-[10px] font-mono w-14 text-right', pctColor)}>
          {ticker.priceChangePercent >= 0 ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
        </span>
      </div>

      {/* Row 3: timeframe breakdown pills */}
      <div className="flex gap-1 pl-6 flex-wrap">
        {(['15m', '30m', '1h', '4h'] as const).map((tf) => {
          const tfData = signal.breakdown[tf]
          if (!tfData) return null
          const score = tfData.combinedScore
          const c = score >= 60 ? 'text-green-400 bg-green-500/10' :
                    score <= 40 ? 'text-red-400 bg-red-500/10' :
                    'text-yellow-400 bg-yellow-500/10'
          return (
            <span key={tf} className={cn('text-[9px] px-1.5 py-0.5 rounded', c)}>
              {tf.toUpperCase()} {score.toFixed(0)}%
            </span>
          )
        })}
      </div>
    </motion.button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function BullishWatchlist({ tickers, exchange, marketType, onSelectCoin }: Props) {
  const [threshold, setThreshold] = useState(55)
  const { results, status, progress, scannedCount, totalCount, lastRunAt, runScan, cancelScan } =
    useBullishScanner(tickers, exchange, marketType)

  const filtered = useMemo(
    () => results.filter((r) => r.signal.bullishPct >= threshold),
    [results, threshold]
  )

  const timeAgo = lastRunAt
    ? (() => {
        const s = Math.floor((Date.now() - lastRunAt) / 1000)
        return s < 60 ? `${s}d lalu` : `${Math.floor(s / 60)}m lalu`
      })()
    : null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs font-bold text-foreground">Bullish Scanner</span>
            {status === 'done' && (
              <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {filtered.length} hasil
              </span>
            )}
          </div>
          {timeAgo && status !== 'scanning' && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" /> {timeAgo}
            </span>
          )}
        </div>

        {/* Threshold filter */}
        <div className="flex items-center gap-1 mb-2">
          <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
          <div className="flex gap-1">
            {THRESHOLD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setThreshold(opt.value)}
                className={cn(
                  'px-2 py-0.5 text-[9px] rounded border transition-colors',
                  threshold === opt.value
                    ? 'border-green-500/50 text-green-400 bg-green-500/10'
                    : 'border-border text-muted-foreground hover:border-muted-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scan button / progress */}
        {status === 'scanning' ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Scanning {scannedCount}/{totalCount} koin...
              </span>
              <button
                onClick={cancelScan}
                className="text-[9px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
              >
                <X className="h-2.5 w-2.5" /> Batal
              </button>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : (
          <motion.button
            onClick={runScan}
            disabled={tickers.length === 0}
            whileTap={{ scale: 0.97 }}
            className="w-full py-1.5 rounded-md bg-green-500/15 text-green-400 text-[11px] font-bold
                       border border-green-500/30 flex items-center justify-center gap-1.5
                       hover:bg-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'idle' ? (
              <><Scan className="h-3 w-3" /> Mulai Scan ({Math.min(tickers.length, 80)} koin)</>
            ) : (
              <><RefreshCw className="h-3 w-3" /> Scan Ulang</>
            )}
          </motion.button>
        )}
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {status === 'idle' && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Bullish Scanner MTF</p>
              <p className="text-[10px] leading-relaxed">
                Klik "Mulai Scan" untuk menganalisis semua koin berdasarkan<br />
                Multi-Timeframe (15m, 30m, 1h, 4h)<br />
                dengan kombinasi Classic & Weighted Signal.
              </p>
            </div>
          </div>
        )}

        {filtered.length === 0 && status === 'done' && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground px-4 text-center">
            <Minus className="h-5 w-5" />
            <p className="text-[10px]">Tidak ada koin yang memenuhi threshold {threshold}% saat ini.</p>
            <button
              onClick={() => setThreshold(0)}
              className="text-[10px] text-primary hover:underline"
            >
              Tampilkan semua
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filtered.map((result, i) => (
            <ResultRow
              key={result.ticker.symbol}
              result={result}
              rank={i + 1}
              onClick={() => onSelectCoin(result.ticker)}
            />
          ))}
        </AnimatePresence>

        {/* Live streaming indicator while scanning */}
        {status === 'scanning' && filtered.length > 0 && (
          <div className="px-3 py-2 text-[9px] text-muted-foreground flex items-center gap-1 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Hasil diperbarui secara live...
          </div>
        )}
      </div>
    </div>
  )
}

