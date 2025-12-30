/**
 * API Service - Cliente para endpoints do backend
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'  // ✅ OBRIGATÓRIO: permite cookies HttpOnly
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    // Se resposta tem formato { success: true, data: {...} }
    if (data.success && data.data) {
      return data.data as T
    }
    
    // Se resposta é direta
    return data as T
  }

  // Auth
  async getNonce(address: string): Promise<{ nonce: string }> {
    return this.request('/api/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ address })
    })
  }

  async siweLogin(message: string, signature: string): Promise<any> {
    return this.request('/api/auth/siwe', {
      method: 'POST',
      body: JSON.stringify({ message, signature })
    })
  }

  async verifyToken(): Promise<{ valid: boolean; address?: string; tier?: string }> {
    return this.request('/api/auth/verify')
  }

  async logout(): Promise<void> {
    return this.request('/api/auth/logout', { method: 'POST' })
  }

  // Global Metrics
  async getGlobalMetrics(): Promise<{
    market_cap: number
    btc_dominance: number
    eth_dominance: number
    breadth: { gainers: number; losers: number }
    timestamp: number
  }> {
    return this.request('/api/v1/global-metrics')
  }

  // System Status
  async getSystemStatus(): Promise<any> {
    return this.request('/api/v1/system/status')
  }

  // Chart Data
  async getChartData(
    symbol: string,
    interval: string = '1h',
    limit: number = 500
  ): Promise<{
    success: boolean
    symbol: string
    timeframe: string
    candles: Array<{
      time: number
      open: number
      high: number
      low: number
      close: number
      volume: number
    }>
    indicators: {
      ema8: Array<{ time: number; value: number }>
      ema21: Array<{ time: number; value: number }>
      rsi: Array<{ time: number; value: number }>
    }
    levels: {
      supports: number[]
      resistances: number[]
      operational: {
        entry: number | null
        stop_loss: number | null
        take_profit: (number | null)[]
      }
    }
    current_price: number
    timestamp: number
  }> {
    return this.request(
      `/api/v1/chart-data?symbol=${symbol}&interval=${interval}&limit=${limit}`
    )
  }

  // Analyze
  async analyze(symbol: string, timeframe: string): Promise<any> {
    return this.request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ symbol, timeframe })
    })
  }

  // Signal
  async getSignal(symbol: string, timeframe: string): Promise<{
    status: string
    symbol: string
    timeframe: string
    signal: 'BUY' | 'SELL' | 'NEUTRAL'
    score: number
    confidence: number
    entry: number | null
    stop_loss: number | null
    take_profit: number | null
    timestamp: number
  }> {
    return this.request(`/api/signal?symbol=${symbol}&timeframe=${timeframe}`)
  }
}

export const api = new ApiClient()
export default api

