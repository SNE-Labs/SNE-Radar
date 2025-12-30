import { useState } from 'react'
import { Activity } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { analysisApi } from '../services/api'
import { Button } from '../app/components/Button'
import { formatCurrency, cn } from '../lib/utils'
import { toast } from 'sonner'

export default function Analysis() {
  const { tier, isAuthenticated } = useWallet()
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1h')

  const tierLimits = {
    free: { analyses: 3 },
    premium: { analyses: 50 },
    pro: { analyses: 1000 },
  }

  const currentLimits = tierLimits[tier]

  const runAnalysis = async () => {
    if (!isAuthenticated) {
      toast.error('Conecte sua wallet primeiro')
      return
    }

    setLoading(true)
    try {
      const response = await analysisApi.analyze(symbol, timeframe)
      setAnalysisResult(response.data)
      toast.success('Análise concluída!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao executar análise')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-[#A6A6A6] mb-4">Conecte sua wallet para acessar a análise</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Technical Analysis</h2>
        <span className="text-sm text-[#A6A6A6]">
          Análises hoje: <span className="text-[#FF6A00] font-mono">0/{currentLimits.analyses}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-3 font-mono"
          >
            <option>BTCUSDT</option>
            {tier !== 'free' && <option>ETHUSDT</option>}
            {tier === 'pro' && <option>SOLUSDT</option>}
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-3 font-mono"
          >
            <option>1h</option>
            <option>4h</option>
            <option>1d</option>
          </select>

          <Button onClick={runAnalysis} disabled={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Executar Análise'}
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {analysisResult ? (
            <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-6 space-y-6">
              {/* Score Geral */}
              <div>
                <div className="text-sm text-[#A6A6A6] mb-2">Score Geral</div>
                <div className="text-5xl font-mono font-bold text-[#FF6A00]">
                  {safeNumber(analysisResult.analysis?.score || analysisResult.analysis?.confluence_score * 10, 0)}/100
                </div>
              </div>

              {/* Setup e Probabilidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#A6A6A6] mb-1">Setup Identificado</div>
                  <div className="text-xl font-semibold">
                    {safeString(analysisResult.analysis?.setup || analysisResult.analysis?.bias, 'INDEFINIDO')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#A6A6A6] mb-1">Probabilidade</div>
                  <div className="text-xl font-semibold text-[#00C48C]">
                    {safeNumber(analysisResult.analysis?.probability, 0)}%
                  </div>
                </div>
              </div>

              {/* Níveis Operacionais */}
              <div>
                <div className="text-sm text-[#A6A6A6] mb-3">Níveis Operacionais</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-[#1B1B1F] rounded-md border border-[rgba(0,200,140,0.3)]">
                    <span className="text-sm">Entry</span>
                    <span className="font-mono font-bold text-[#00C48C]">
                      {formatCurrency(analysisResult.analysis?.entry)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#1B1B1F] rounded-md border border-[rgba(255,77,79,0.3)]">
                    <span className="text-sm">Stop Loss</span>
                    <span className="font-mono font-bold text-[#FF4D4F]">
                      {formatCurrency(analysisResult.analysis?.sl || analysisResult.analysis?.stop_loss)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#1B1B1F] rounded-md border border-[rgba(255,200,87,0.3)]">
                    <span className="text-sm">TP1</span>
                    <span className="font-mono font-bold text-[#FFC857]">
                      {formatCurrency(analysisResult.analysis?.tp1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#1B1B1F] rounded-md border border-[rgba(255,200,87,0.3)]">
                    <span className="text-sm">TP2</span>
                    <span className="font-mono font-bold text-[#FFC857]">
                      {formatCurrency(analysisResult.analysis?.tp2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#1B1B1F] rounded-md border border-[rgba(255,200,87,0.3)]">
                    <span className="text-sm">TP3</span>
                    <span className="font-mono font-bold text-[#FFC857]">
                      {formatCurrency(analysisResult.analysis?.tp3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk/Reward Ratio */}
              <div>
                <div className="text-sm text-[#A6A6A6] mb-2">Risk/Reward Ratio</div>
                <div className="text-2xl font-mono font-bold">
                  {safeString(analysisResult.analysis?.riskReward || analysisResult.analysis?.risk_reward, '1:1')}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111216] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-[#A6A6A6]">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Selecione um símbolo e clique em "Executar Análise"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

