import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { chartApi } from '../services/api'
import { cn } from '../lib/utils'
import Chart from '../components/Chart'

export default function ChartPage() {
  const { tier, isAuthenticated } = useWallet()
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1h')
  const [indicators, setIndicators] = useState<any>(null)
  const [loadingIndicators, setLoadingIndicators] = useState(false)

  const availableTimeframes = tier === 'free'
    ? ['15m', '1h', '4h', '1d']
    : ['1m', '5m', '15m', '1h', '4h', '1d']

  useEffect(() => {
    if (!isAuthenticated) return

    const loadIndicators = async () => {
      try {
        setLoadingIndicators(true)
        const response = await chartApi.getIndicators(selectedSymbol, timeframe, tier === 'free' ? 'basic' : 'advanced')
        setIndicators(response.data)
      } catch (error) {
        console.error('Failed to load indicators:', error)
      } finally {
        setLoadingIndicators(false)
      }
    }

    loadIndicators()
    const interval = setInterval(loadIndicators, 30000) // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [selectedSymbol, timeframe, tier, isAuthenticated])

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 font-mono text-[#F7F7F8]"
        >
          <option>BTCUSDT</option>
          {tier !== 'free' && <option>ETHUSDT</option>}
          {tier === 'pro' && <option>SOLUSDT</option>}
        </select>

        <div className="flex gap-2">
          {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => {
            const isAvailable = availableTimeframes.includes(tf)
            return (
              <button
                key={tf}
                onClick={() => isAvailable && setTimeframe(tf)}
                disabled={!isAvailable}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-mono transition-all',
                  timeframe === tf && isAvailable
                    ? 'bg-[#FF6A00] text-white'
                    : 'bg-[#111216] border border-[rgba(255,255,255,0.1)] hover:border-[#FF6A00]',
                  !isAvailable && 'opacity-30 cursor-not-allowed'
                )}
              >
                {tf}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Component */}
      <Chart symbol={selectedSymbol} timeframe={timeframe} height={600} />

      {/* Indicators Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RSI - Sempre disponível */}
        <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-4">
          <div className="text-sm text-[#A6A6A6] mb-2">RSI (14)</div>
          {loadingIndicators ? (
            <div className="h-8 w-16 bg-[#1B1B1F] rounded animate-pulse"></div>
          ) : (
            <div className={cn(
              'text-2xl font-mono font-bold',
              indicators?.rsi && safeNumber(indicators.rsi, 0) > 70 ? 'text-[#FF4D4F]' :
              indicators?.rsi && safeNumber(indicators.rsi, 0) < 30 ? 'text-[#00C48C]' : 'text-[#F7F7F8]'
            )}>
              {safeNumber(indicators?.rsi, 0).toFixed(1) || '--'}
            </div>
          )}
        </div>

        {/* MACD - Sempre disponível */}
        <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-4">
          <div className="text-sm text-[#A6A6A6] mb-2">MACD</div>
          {loadingIndicators ? (
            <div className="h-8 w-16 bg-[#1B1B1F] rounded animate-pulse"></div>
          ) : (
            <div className={cn(
              'text-2xl font-mono font-bold',
              indicators?.macd && safeNumber(indicators.macd, 0) > 0 ? 'text-[#00C48C]' : 'text-[#FF4D4F]'
            )}>
              {indicators?.macd ? (safeNumber(indicators.macd, 0) > 0 ? '+' : '') + safeNumber(indicators.macd, 0).toFixed(2) : '--'}
            </div>
          )}
        </div>

        {/* Volume - Sempre disponível */}
        <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-4">
          <div className="text-sm text-[#A6A6A6] mb-2">Volume 24h</div>
          {loadingIndicators ? (
            <div className="h-8 w-16 bg-[#1B1B1F] rounded animate-pulse"></div>
          ) : (
            <div className="text-2xl font-mono font-bold">
              {indicators?.volume ? (safeNumber(indicators.volume, 0) / 1e6).toFixed(1) + 'M' : '--'}
            </div>
          )}
        </div>

        {/* Indicadores avançados - Apenas premium+ */}
        {tier !== 'free' && (
          <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-4">
            <div className="text-sm text-[#A6A6A6] mb-2">
              {tier === 'pro' ? 'Bollinger Bands' : 'Stochastic'}
            </div>
            {loadingIndicators ? (
              <div className="h-8 w-16 bg-[#1B1B1F] rounded animate-pulse"></div>
            ) : (
              <div className="text-lg font-mono font-bold">
                {tier === 'pro' && indicators?.bollinger_bands ? (
                  <div className="text-xs space-y-1">
                    <div>U: {safeNumber(indicators.bollinger_bands.upper, 0).toFixed(0)}</div>
                    <div>L: {safeNumber(indicators.bollinger_bands.lower, 0).toFixed(0)}</div>
                  </div>
                ) : tier !== 'free' && indicators?.stochastic ? (
                  <div className="text-xs space-y-1">
                    <div>K: {safeNumber(indicators.stochastic.k, 0).toFixed(1)}</div>
                    <div>D: {safeNumber(indicators.stochastic.d, 0).toFixed(1)}</div>
                  </div>
                ) : (
                  '--'
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {tier === 'free' && (
        <div className="bg-[rgba(255,106,0,0.1)] border border-[rgba(255,106,0,0.3)] rounded-[10px] p-4 text-center">
          <p className="text-sm text-[#FF6A00]">
            Upgrade to Premium for advanced charts, more timeframes, and additional indicators
          </p>
        </div>
      )}
    </div>
  )
}

