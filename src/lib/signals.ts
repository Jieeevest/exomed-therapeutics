import {
  calcEMA, calcRSI, calcMACD, calcStochRSI, calcSupertrend,
  detectPattern, findSR,
  type Candle, type PatternResult,
} from './indicators'

export type Direction = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL'

export interface IndicatorSignal {
  signal: 1 | 0 | -1
  label: string
  detail: string
  score: number
  maxScore: number
}

export interface SignalResult {
  direction: Direction
  confluence: number   // 0–100 — berapa % indikator sepakat
  score: number
  maxScore: number
  trend: 'Uptrend' | 'Downtrend' | 'Sideways'
  indicators: {
    ema: IndicatorSignal
    rsi: IndicatorSignal
    macd: IndicatorSignal
    stochRsi: IndicatorSignal
    supertrend: IndicatorSignal
    volume: IndicatorSignal
  }
  pattern: PatternResult
  support: number
  resistance: number
  summary: string
}

function sigOf(score: number): 1 | 0 | -1 {
  return score > 0 ? 1 : score < 0 ? -1 : 0
}

export function generateSignal(candles: Candle[]): SignalResult | null {
  if (candles.length < 60) return null

  const closes = candles.map((c) => c.close)
  const volumes = candles.map((c) => c.volume)
  const lastClose = closes[closes.length - 1]
  const lastCandle = candles[candles.length - 1]

  // ── Indicators ───────────────────────────────────────────────
  const ema9  = calcEMA(closes, 9)
  const ema21 = calcEMA(closes, 21)
  const ema50 = calcEMA(closes, 50)
  const rsiArr = calcRSI(closes, 14)
  const { macd: macdArr, signal: sigArr, histogram: histArr } = calcMACD(closes)
  const { k: stochK, d: stochD } = calcStochRSI(closes)
  const stArr = calcSupertrend(candles)
  const pattern = detectPattern(candles)
  const { support, resistance } = findSR(candles)

  const e9  = ema9[ema9.length - 1]
  const e21 = ema21[ema21.length - 1]
  const e50 = ema50[ema50.length - 1]
  const rsi = rsiArr[rsiArr.length - 1]
  const hist    = histArr[histArr.length - 1]
  const prevHist = histArr[histArr.length - 2]
  const sk = stochK[stochK.length - 1]
  const sd = stochD[stochD.length - 1]
  const prevSk = stochK[stochK.length - 2]
  const st = stArr[stArr.length - 1]

  const avgVol  = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20
  const lastVol = volumes[volumes.length - 1]
  const volRatio = lastVol / (avgVol || 1)
  const isBull  = lastCandle.close >= lastCandle.open

  // ── EMA (max 3) ──────────────────────────────────────────────
  let emaScore = 0
  let emaLabel = ''
  const allBull = lastClose > e9 && e9 > e21 && e21 > e50
  const allBear = lastClose < e9 && e9 < e21 && e21 < e50

  if (allBull)                    { emaScore = 3;  emaLabel = 'Bullish sempurna (9>21>50)' }
  else if (allBear)               { emaScore = -3; emaLabel = 'Bearish sempurna (9<21<50)' }
  else if (lastClose > e21 && e9 > e21) { emaScore = 2; emaLabel = 'Di atas EMA 21 & 9' }
  else if (lastClose < e21 && e9 < e21) { emaScore = -2; emaLabel = 'Di bawah EMA 21 & 9' }
  else if (lastClose > e21)       { emaScore = 1;  emaLabel = 'Di atas EMA 21' }
  else                            { emaScore = -1; emaLabel = 'Di bawah EMA 21' }

  // ── RSI (max 2) ──────────────────────────────────────────────
  let rsiScore = 0
  let rsiLabel = ''

  if (rsi < 30)      { rsiScore = 2;  rsiLabel = `Oversold (${rsi.toFixed(1)}) — potensi rebound` }
  else if (rsi > 70) { rsiScore = -2; rsiLabel = `Overbought (${rsi.toFixed(1)}) — potensi koreksi` }
  else if (rsi >= 55 && rsi < 70) { rsiScore = 1;  rsiLabel = `Bullish zone (${rsi.toFixed(1)})` }
  else if (rsi > 30  && rsi < 45) { rsiScore = -1; rsiLabel = `Bearish zone (${rsi.toFixed(1)})` }
  else                             { rsiScore = 0;  rsiLabel = `Netral (${rsi.toFixed(1)})` }

  // ── MACD (max 3) ─────────────────────────────────────────────
  let macdScore = 0
  let macdLabel = ''
  const macdCrossUp   = prevHist < 0 && hist >= 0
  const macdCrossDown = prevHist > 0 && hist <= 0

  if (macdCrossUp)                   { macdScore = 3;  macdLabel = 'Golden cross (bullish)' }
  else if (macdCrossDown)            { macdScore = -3; macdLabel = 'Death cross (bearish)' }
  else if (hist > 0 && hist > prevHist) { macdScore = 2; macdLabel = 'Histogram naik (momentum +)' }
  else if (hist < 0 && hist < prevHist) { macdScore = -2; macdLabel = 'Histogram turun (momentum -)' }
  else if (hist > 0)                 { macdScore = 1;  macdLabel = 'Positif (lemah)' }
  else                               { macdScore = -1; macdLabel = 'Negatif (lemah)' }

  // ── Stoch RSI (max 2) ────────────────────────────────────────
  let stochScore = 0
  let stochLabel = ''
  const stochCrossUp   = prevSk !== undefined && sk > sd && prevSk <= stochD[stochD.length - 2]
  const stochCrossDown = prevSk !== undefined && sk < sd && prevSk >= stochD[stochD.length - 2]

  if (sk < 20)          { stochScore = 2;  stochLabel = `Oversold (${sk.toFixed(0)}) — rebound` }
  else if (sk > 80)     { stochScore = -2; stochLabel = `Overbought (${sk.toFixed(0)}) — koreksi` }
  else if (stochCrossUp)   { stochScore = 2; stochLabel = `K melewati D ke atas (${sk.toFixed(0)})` }
  else if (stochCrossDown) { stochScore = -2; stochLabel = `K melewati D ke bawah (${sk.toFixed(0)})` }
  else if (sk > sd && sk > 50) { stochScore = 1;  stochLabel = `K>D zona bullish (${sk.toFixed(0)})` }
  else if (sk < sd && sk < 50) { stochScore = -1; stochLabel = `K<D zona bearish (${sk.toFixed(0)})` }
  else                  { stochScore = 0;  stochLabel = `Netral (${sk.toFixed(0)})` }

  // ── Supertrend (max 3) ───────────────────────────────────────
  let stScore = 0
  let stLabel = ''
  if (st) {
    const prevSt = stArr[stArr.length - 2]
    const switched = prevSt && st.direction !== prevSt.direction
    if (st.direction === 1) {
      stScore = switched ? 3 : 2
      stLabel = switched ? 'Baru balik ke Bullish ↑' : 'Bullish (harga di atas)'
    } else {
      stScore = switched ? -3 : -2
      stLabel = switched ? 'Baru balik ke Bearish ↓' : 'Bearish (harga di bawah)'
    }
  }

  // ── Volume (max 2) ───────────────────────────────────────────
  let volScore = 0
  let volLabel = ''
  if (volRatio > 1.5) {
    volScore  = isBull ? 2 : -2
    volLabel  = `Volume ${volRatio.toFixed(1)}x — konfirmasi ${isBull ? 'bullish' : 'bearish'}`
  } else if (volRatio > 1) {
    volScore  = isBull ? 1 : -1
    volLabel  = `Volume di atas rata-rata (${volRatio.toFixed(1)}x)`
  } else {
    volScore  = 0
    volLabel  = `Volume rendah (${volRatio.toFixed(1)}x) — konfirmasi lemah`
  }

  // ── Pattern (max 3) ──────────────────────────────────────────
  const patternScore = pattern.signal * pattern.strength

  // ── Total ────────────────────────────────────────────────────
  const MAX = 3 + 2 + 3 + 2 + 3 + 2 + 3   // 18
  const totalScore = emaScore + rsiScore + macdScore + stochScore + stScore + volScore + patternScore

  // Confluence: % indikator (tanpa pattern) yang sepakat dengan arah mayoritas
  const indScores = [emaScore, rsiScore, macdScore, stochScore, stScore, volScore]
  const bullCount = indScores.filter((s) => s > 0).length
  const bearCount = indScores.filter((s) => s < 0).length
  const totalInd  = indScores.length
  const confluence = Math.round((Math.max(bullCount, bearCount) / totalInd) * 100)

  // Direction thresholds
  let direction: Direction
  if (totalScore >= 11)       direction = 'STRONG_BUY'
  else if (totalScore >= 5)   direction = 'BUY'
  else if (totalScore <= -11) direction = 'STRONG_SELL'
  else if (totalScore <= -5)  direction = 'SELL'
  else                        direction = 'NEUTRAL'

  // Trend structure (EMA 21 vs 50)
  const trend: SignalResult['trend'] =
    e21 > e50 && lastClose > e21 ? 'Uptrend'
    : e21 < e50 && lastClose < e21 ? 'Downtrend'
    : 'Sideways'

  // Summary text
  const summaryMap: Record<Direction, string> = {
    STRONG_BUY:  'Momentum bullish kuat — mayoritas indikator konfirmasi naik',
    BUY:         'Momentum bullish — lebih banyak indikator mendukung kenaikan',
    NEUTRAL:     'Sinyal campuran — tunggu konfirmasi lebih lanjut',
    SELL:        'Momentum bearish — lebih banyak indikator mendukung penurunan',
    STRONG_SELL: 'Momentum bearish kuat — mayoritas indikator konfirmasi turun',
  }

  return {
    direction,
    confluence,
    score: totalScore,
    maxScore: MAX,
    trend,
    indicators: {
      ema:        { signal: sigOf(emaScore),   label: 'EMA 9/21/50',   detail: emaLabel,   score: emaScore,   maxScore: 3 },
      rsi:        { signal: sigOf(rsiScore),   label: 'RSI 14',        detail: rsiLabel,   score: rsiScore,   maxScore: 2 },
      macd:       { signal: sigOf(macdScore),  label: 'MACD',          detail: macdLabel,  score: macdScore,  maxScore: 3 },
      stochRsi:   { signal: sigOf(stochScore), label: 'Stoch RSI',     detail: stochLabel, score: stochScore, maxScore: 2 },
      supertrend: { signal: sigOf(stScore),    label: 'Supertrend',    detail: stLabel,    score: stScore,    maxScore: 3 },
      volume:     { signal: sigOf(volScore),   label: 'Volume',        detail: volLabel,   score: volScore,   maxScore: 2 },
    },
    pattern,
    support,
    resistance,
    summary: summaryMap[direction],
  }
}
