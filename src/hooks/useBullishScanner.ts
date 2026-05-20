import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import type { Ticker, Exchange, MarketType } from '@/types'
import type { Candle } from '@/lib/indicators'
import { generateMTFSignal, type MTFSignalResult, type Timeframe } from '@/lib/signals'

export interface ScanResult {
  ticker: Ticker
  signal: MTFSignalResult
  scannedAt: number
}

export type ScanStatus = 'idle' | 'scanning' | 'done' | 'error'

const TIMEFRAMES: Timeframe[] = ['15m', '30m', '1h', '4h']

// Helper untuk fetch satu timeframe
async function fetchCandleTf(
  symbol: string,
  exchange: Exchange,
  marketType: MarketType,
  tf: Timeframe
): Promise<Candle[]> {
  try {
    switch (exchange) {
      case 'binance': {
        const base = marketType === 'futures'
          ? 'https://fapi.binance.com/fapi/v1'
          : 'https://api.binance.com/api/v3'
        const { data } = await axios.get(`${base}/klines`, {
          params: { symbol, interval: tf, limit: 150 },
          timeout: 8000,
        })
        return (data as any[]).map((d) => ({
          time: d[0], open: parseFloat(d[1]), high: parseFloat(d[2]),
          low: parseFloat(d[3]), close: parseFloat(d[4]), volume: parseFloat(d[5]),
        }))
      }
      case 'kucoin': {
        if (marketType === 'futures') {
          const granMap: Record<string, number> = { '15m': 15, '30m': 30, '1h': 60, '4h': 240 }
          const to = Date.now()
          const from = to - 60 * 1000 * granMap[tf] * 150
          const { data } = await axios.get('https://api-futures.kucoin.com/api/v1/kline/query', {
            params: { symbol, granularity: granMap[tf], from, to },
            timeout: 8000,
          })
          return ((data?.data ?? []) as any[]).map((d: any) => ({
            time: d[0], open: parseFloat(d[1]), high: parseFloat(d[3]),
            low: parseFloat(d[4]), close: parseFloat(d[2]), volume: parseFloat(d[5]),
          }))
        } else {
          const typeMap: Record<string, string> = { '15m': '15min', '30m': '30min', '1h': '1hour', '4h': '4hour' }
          const { data } = await axios.get('https://api.kucoin.com/api/v1/market/candles', {
            params: { symbol, type: typeMap[tf] },
            timeout: 8000,
          })
          return ((data?.data ?? []) as any[]).reverse().map((d: any) => ({
            time: parseInt(d[0]) * 1000, open: parseFloat(d[1]), close: parseFloat(d[2]),
            high: parseFloat(d[3]), low: parseFloat(d[4]), volume: parseFloat(d[5]),
          }))
        }
      }
      case 'okx': {
        const barMap: Record<string, string> = { '15m': '15m', '30m': '30m', '1h': '1H', '4h': '4H' }
        const { data } = await axios.get('https://www.okx.com/api/v5/market/candles', {
          params: { instId: symbol, bar: barMap[tf], limit: 150 },
          timeout: 8000,
        })
        return ((data?.data ?? []) as any[]).reverse().map((d: any) => ({
          time: parseInt(d[0]), open: parseFloat(d[1]), high: parseFloat(d[2]),
          low: parseFloat(d[3]), close: parseFloat(d[4]), volume: parseFloat(d[5]),
        }))
      }
      case 'cryptocom': {
        const { data } = await axios.get(
          'https://api.crypto.com/exchange/v1/public/get-candlestick',
          { params: { instrument_name: symbol, timeframe: tf, count: 150 }, timeout: 8000 }
        )
        return ((data?.result?.data ?? []) as any[]).reverse().map((d: any) => ({
          time: d.t, open: parseFloat(d.o), high: parseFloat(d.h),
          low: parseFloat(d.l), close: parseFloat(d.c), volume: parseFloat(d.v),
        }))
      }
    }
  } catch {
    return []
  }
}

// ── Multi-Timeframe fetcher ─────────────────────────────────────────────
async function fetchMultiTimeframeCandles(
  symbol: string,
  exchange: Exchange,
  marketType: MarketType
): Promise<Record<string, Candle[]>> {
  const map: Record<string, Candle[]> = {}
  await Promise.all(
    TIMEFRAMES.map(async (tf) => {
      map[tf] = await fetchCandleTf(symbol, exchange, marketType, tf)
    })
  )
  return map
}

// ── Delay helper ─────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const BATCH_SIZE = 3       // Kurangi batch size karena tiap koin request 4x
const BATCH_DELAY_MS = 500 // Tambah delay jadi 500ms agar lebih aman dari rate limit
const MAX_TICKERS = 80     // scan top 80 by volume

export function useBullishScanner(
  tickers: Ticker[],
  exchange: Exchange,
  marketType: MarketType
) {
  const [results, setResults] = useState<ScanResult[]>([])
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [progress, setProgress] = useState(0)   // 0–100
  const [scannedCount, setScannedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [lastRunAt, setLastRunAt] = useState<number | null>(null)
  const abortRef = useRef(false)

  const runScan = useCallback(async () => {
    if (!tickers.length) return
    abortRef.current = false

    // Take top N by volume
    const pool = [...tickers]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, MAX_TICKERS)

    setStatus('scanning')
    setProgress(0)
    setScannedCount(0)
    setTotalCount(pool.length)
    setResults([])

    const accumulated: ScanResult[] = []
    let done = 0

    // Process in batches
    for (let i = 0; i < pool.length; i += BATCH_SIZE) {
      if (abortRef.current) break
      const batch = pool.slice(i, i + BATCH_SIZE)

      const batchResults = await Promise.all(
        batch.map(async (ticker) => {
          const candlesMap = await fetchMultiTimeframeCandles(ticker.symbol, exchange, marketType)
          
          // Pastikan minimal ada data 1h dan cukup panjang
          if (!candlesMap['1h'] || candlesMap['1h'].length < 60) return null
          
          const signal = generateMTFSignal(candlesMap, null, ticker.fundingRate) // fgValue null for now
          if (!signal) return null
          
          return { ticker, signal, scannedAt: Date.now() } as ScanResult
        })
      )

      done += batch.length
      setScannedCount(done)
      setProgress(Math.round((done / pool.length) * 100))

      const valid = batchResults.filter((r): r is ScanResult => r !== null)
      accumulated.push(...valid)

      // Keep results sorted live while scanning
      const sorted = [...accumulated].sort((a, b) => b.signal.bullishPct - a.signal.bullishPct)
      setResults(sorted)

      if (i + BATCH_SIZE < pool.length) await delay(BATCH_DELAY_MS)
    }

    if (!abortRef.current) {
      setStatus('done')
      setLastRunAt(Date.now())
    }
  }, [tickers, exchange, marketType])

  const cancelScan = useCallback(() => {
    abortRef.current = true
    setStatus('idle')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current = true }
  }, [])

  return { results, status, progress, scannedCount, totalCount, lastRunAt, runScan, cancelScan }
}
