const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || ''
const WS_DOMAIN  = import.meta.env.VITE_WS_DOMAIN  || 'wss://cryptoex.id'

export const API_URLS = {
  internal: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  binance: {
    spot:      `${API_DOMAIN}/binance/api/v3`,
    futures:   `${API_DOMAIN}/binance-futures/fapi/v1`,
    ws:        `${WS_DOMAIN}/binance-ws`,
    wsFutures: `${WS_DOMAIN}/binance-futures-ws`,
  },

  kucoin: {
    spot:    `${API_DOMAIN}/kucoin/api/v1`,
    futures: `${API_DOMAIN}/kucoin-futures/api/v1`,
  },

  okx: {
    market: `${API_DOMAIN}/okx/api/v5/market`,
    public: `${API_DOMAIN}/okx/api/v5/public`,
  },

  cryptoCom: {
    public: `${API_DOMAIN}/crypto-com/exchange/v1/public`,
  },

  fearGreed: `${API_DOMAIN}/fear-greed/?limit=1&format=json`,

  tradingView: {
    script: 'https://s3.tradingview.com/tv.js',
  },
}
