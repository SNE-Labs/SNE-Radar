// ============================================
// SNE RADAR - CHART API SERVICE v2.2
// Serviços específicos para Dados de Gráfico
// ============================================

import { api } from './api'
import type { CandleData, LevelsData } from '../types/analysis'

// ============================================
// CHART ENDPOINTS
// ============================================

export const chartApi = {
  /**
   * Busca dados consolidados para gráfico
   */
  getChartData: (symbol: string, timeframe: string): Promise<{
    data: {
      candles: CandleData[]
      levels?: LevelsData
      current_price: number
    }
  }> =>
    api.get('/api/chart/data', { params: { symbol, timeframe } }),

  /**
   * Busca candles históricos
   */
  getCandles: (symbol: string, timeframe: string, limit: number = 500): Promise<{
    data: { candles: CandleData[] }
  }> =>
    api.get('/api/chart/candles', { params: { symbol, timeframe, limit } }),

  /**
   * Busca níveis de suporte/resistência
   */
  getLevels: (symbol: string, timeframe: string): Promise<{ data: LevelsData }> =>
    api.get('/api/chart/levels', { params: { symbol, timeframe } }),

  /**
   * Busca preço atual
   */
  getLastPrice: (symbol: string, timeframe: string): Promise<{
    data: { price: number; timestamp: number }
  }> =>
    api.get('/api/chart/price', { params: { symbol, timeframe } }),

  /**
   * Busca indicadores técnicos
   */
  getIndicators: (symbol: string, timeframe: string, type: 'basic' | 'advanced' = 'basic') =>
    api.get('/api/chart/indicators', { params: { symbol, timeframe, type } }),

  /**
   * Busca dados de volume
   */
  getVolumeData: (symbol: string, timeframe: string, limit: number = 100) =>
    api.get('/api/chart/volume', { params: { symbol, timeframe, limit } }),

  /**
   * Busca configurações de gráfico
   */
  getChartSettings: () => api.get('/api/chart/settings'),

  /**
   * Salva configurações de gráfico
   */
  saveChartSettings: (settings: any) => api.post('/api/chart/settings', settings)
}
