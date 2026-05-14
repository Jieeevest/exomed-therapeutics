import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw, ShieldAlert } from 'lucide-react'
import type { Exchange, MarketType, Ticker } from '@/types'
import { useSignalData, SIGNAL_TIMEFRAMES, type SignalTimeframe } from '@/hooks/useSignalData'
import { generateSignal, type Direction, type SignalResult } from '@/lib/signals'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  ticker: Ticker | null
  exchange: Exchange
  marketType: MarketType
  currentPrice: number
}

const DIR_CFG: Record<Direction, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  STRONG_BUY:  { label: 'BULLISH KUAT',  color: 'text-green-400',  bg: 'bg-green-500/15',  border: 'border-green-500/40',  icon: <TrendingUp className="h-4 w-4" /> },
  BUY:         { label: 'BULLISH',        color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: <TrendingUp className="h-4 w-4" /> },
  NEUTRAL:     { label: 'NETRAL',         color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Minus className="h-4 w-4" /> },
  SELL:        { label: 'BEARISH',        color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: <TrendingDown className="h-4 w-4" /> },
  STRONG_SELL: { label: 'BEARISH KUAT',  color: 'text-red-400',    bg: 'bg-red-500/15',    border: 'border-red-500/40',    icon: <TrendingDown className="h-4 w-4" /> },
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round(((score + max) / (max * 2)) * 100)
  return (
    <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className="absolute inset-y-0 left-1/2 w-px bg-border z-10" />
      <motion.div
        className={cn('absolute inset-y-0 rounded-full', score >= 0 ? 'bg-green-500' : 'bg-red-500')}
        style={{ left: '50%', width: `${Math.abs(pct - 50)}%`, ...(score < 0 ? { right: `${50 - (pct)}%`, left: 'auto' } : {}) }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.abs(pct - 50)}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

function IndRow({ label, signal, detail, score, maxScore }: {
  label: string; signal: 1 | 0 | -1; detail: string; score: number; maxScore: number
}) {
  const dot = signal === 1 ? 'bg-green-400' : signal === -1 ? 'bg-red-400' : 'bg-yellow-400'
  const dots = Array.from({ length: maxScore }, (_, i) => i)
  return (
    <div className="flex items-start gap-2 py-1 border-b border-border/50 last:border-0">
      <span className={cn('mt-1 shrink-0 w-1.5 h-1.5 rounded-full', dot)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-medium text-foreground">{label}</span>
          <div className="flex gap-0.5">
            {dots.map((i) => (
              <span
                key={i}
                className={cn('w-1.5 h-1.5 rounded-full',
                  i < Math.abs(score)
                    ? signal === 1 ? 'bg-green-400' : signal === -1 ? 'bg-red-400' : 'bg-yellow-400'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground leading-tight">{detail}</p>
      </div>
    </div>
  )
}

function TFBadge({ direction }: { direction: Direction | null }) {
  if (!direction) return <span className="text-[9px] text-muted-foreground">—</span>
  const cfg = DIR_CFG[direction]
  return (
    <span className={cn('text-[9px] font-bold px-1 py-0.5 rounded', cfg.color, cfg.bg)}>
      {direction === 'STRONG_BUY' ? '▲▲' : direction === 'BUY' ? '▲' : direction === 'NEUTRAL' ? '—' : direction === 'SELL' ? '▼' : '▼▼'}
      {' '}{cfg.label}
    </span>
  )
}

export function SignalPanel({ ticker, exchange, marketType, currentPrice }: Props) {
  const [activeTF, setActiveTF] = useState<SignalTimeframe>('15m')
  const { candles, loading } = useSignalData(ticker?.symbol ?? '', exchange, marketType, currentPrice)

  const signals = useMemo(() => {
    const map: Partial<Record<SignalTimeframe, SignalResult>> = {}
    for (const tf of SIGNAL_TIMEFRAMES) {
      const s = generateSignal(candles[tf])
      if (s) map[tf] = s
    }
    return map
  }, [candles])

  const active = signals[activeTF]
  const hasPrice = currentPrice > 0

  if (!ticker) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
        Pilih koin untuk melihat sinyal
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Timeframe tabs */}
      <div className="flex border-b border-border shrink-0">
        {SIGNAL_TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTF(tf)}
            className={cn(
              'flex-1 py-1.5 text-[10px] font-semibold transition-colors',
              activeTF === tf
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-border bg-muted/20 shrink-0">
        <span className="text-[9px] text-muted-foreground">
          Harga live: <span className="font-mono text-foreground">{currentPrice > 0 ? currentPrice.toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—'}</span>
        </span>
        <span className="flex items-center gap-1 text-[9px]">
          {hasPrice ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-green-400">Real-time</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
              <span className="text-muted-foreground">Menunggu harga</span>
            </>
          )}
        </span>
      </div>

      {/* Multi-TF snapshot */}
      <div className="grid grid-cols-5 gap-1 px-2 py-2 border-b border-border shrink-0">
        {SIGNAL_TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTF(tf)}
            className={cn('flex flex-col items-center gap-0.5 p-1 rounded transition-colors',
              activeTF === tf ? 'bg-muted' : 'hover:bg-muted/50'
            )}
          >
            <span className="text-[9px] text-muted-foreground">{tf}</span>
            {loading && !signals[tf] ? (
              <RefreshCw className="h-2.5 w-2.5 animate-spin text-muted-foreground" />
            ) : (
              <TFBadge direction={signals[tf]?.direction ?? null} />
            )}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex-1 px-3 py-2">
        {loading && !active ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Menghitung sinyal {activeTF}...</span>
          </div>
        ) : active ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTF}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-3"
            >
              {/* Main signal */}
              <div className={cn('rounded-lg border p-3 flex items-center gap-3', DIR_CFG[active.direction].bg, DIR_CFG[active.direction].border)}>
                <div className={cn('shrink-0', DIR_CFG[active.direction].color)}>
                  {DIR_CFG[active.direction].icon}
                </div>
                <div className="flex-1">
                  <div className={cn('text-sm font-bold', DIR_CFG[active.direction].color)}>
                    {DIR_CFG[active.direction].label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{active.summary}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn('text-base font-bold font-mono', DIR_CFG[active.direction].color)}>
                    {active.confluence}%
                  </div>
                  <div className="text-[9px] text-muted-foreground">konfluensi</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>Skor: {active.score > 0 ? '+' : ''}{active.score} / {active.maxScore}</span>
                  <span className={cn('font-medium',
                    active.trend === 'Uptrend' ? 'text-green-400'
                    : active.trend === 'Downtrend' ? 'text-red-400'
                    : 'text-yellow-400'
                  )}>
                    {active.trend}
                  </span>
                </div>
                <ScoreBar score={active.score} max={active.maxScore} />
              </div>

              {/* Pattern */}
              {active.pattern.name !== '—' && (
                <div className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded border text-[10px]',
                  active.pattern.signal === 1 ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : active.pattern.signal === -1 ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                )}>
                  <span className="font-bold">Pola:</span>
                  <span>{active.pattern.name}</span>
                  <span className="ml-auto opacity-60">{'●'.repeat(active.pattern.strength)}</span>
                </div>
              )}

              {/* Indicators */}
              <div>
                <p className="text-[10px] text-muted-foreground font-medium mb-1">Indikator</p>
                <div className="rounded border border-border px-2">
                  {Object.values(active.indicators).map((ind) => (
                    <IndRow key={ind.label} {...ind} />
                  ))}
                </div>
              </div>

              {/* Support / Resistance */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border border-green-500/20 bg-green-500/5 px-2 py-1.5">
                  <div className="text-[9px] text-muted-foreground">Support</div>
                  <div className="text-xs font-mono font-bold text-green-400">
                    {formatPrice(active.support)}
                  </div>
                </div>
                <div className="rounded border border-red-500/20 bg-red-500/5 px-2 py-1.5">
                  <div className="text-[9px] text-muted-foreground">Resistance</div>
                  <div className="text-xs font-mono font-bold text-red-400">
                    {formatPrice(active.resistance)}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-1.5 rounded bg-muted/50 px-2 py-1.5">
                <ShieldAlert className="h-3 w-3 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-muted-foreground leading-tight">
                  Sinyal bersifat informatif. Konfluensi tinggi menunjukkan probabilitas lebih besar, bukan jaminan. Selalu gunakan manajemen risiko.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center py-6 text-[10px] text-muted-foreground">
            Data tidak cukup untuk timeframe {activeTF}
          </div>
        )}
      </div>
    </div>
  )
}
