import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.snelabs.space',
  withCredentials: true, // Para cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token se necessário (fallback)
api.interceptors.request.use((config) => {
  // Cookie HttpOnly é enviado automaticamente com withCredentials: true
  return config
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.error('Unauthorized - token may be expired')
    }
    return Promise.reject(error)
  }
)

export const dashboardApi = {
  getSummary: () => api.get('/api/dashboard/summary'),
}

export const chartApi = {
  getCandles: (symbol: string, tf: string, limit: number = 500) =>
    api.get('/api/chart/candles', { params: { symbol, tf, limit } }),
  getIndicators: (symbol: string, tf: string, set: 'basic' | 'advanced' = 'basic') =>
    api.get('/api/chart/indicators', { params: { symbol, tf, set } }),
}

export const analysisApi = {
  analyze: (symbol: string, tf: string, params?: any) =>
    api.post('/api/analyze', { symbol, tf, params }),
  getHistory: () => api.get('/api/analyze/history'),
}

export default api
