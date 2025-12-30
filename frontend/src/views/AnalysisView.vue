<template>
  <div class="analysis-view p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Technical Analysis</h1>
      <p class="text-gray-400">Análise técnica completa com níveis operacionais</p>
    </div>

    <!-- Controls -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Symbol</label>
          <input
            v-model="symbol"
            type="text"
            class="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700"
            placeholder="BTCUSDT"
          />
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-2">Timeframe</label>
          <select
            v-model="timeframe"
            class="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700"
          >
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="loadAnalysis"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Analyzing...' : 'Analyze' }}
          </button>
        </div>
        
        <div v-if="analysis" class="flex items-end">
          <div class="text-sm">
            <div class="text-gray-400">Score</div>
            <div class="text-xl font-bold">
              {{ analysis.sintese?.score_combinado?.toFixed(1) || 'N/A' }}/10
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <p class="mt-2 text-gray-400">Executando análise...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded p-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Analysis Results -->
    <div v-else-if="analysis" class="space-y-6">
      <!-- Synthesis -->
      <div v-if="analysis.sintese" class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Synthesis</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm text-gray-400 mb-1">Action</div>
            <div class="text-xl font-bold">{{ analysis.sintese.acao }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Recommendation</div>
            <div class="text-lg">{{ analysis.sintese.recomendacao }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Score</div>
            <div class="text-2xl font-bold">
              {{ analysis.sintese.score_combinado?.toFixed(1) || 'N/A' }}/10
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Risk/Reward</div>
            <div class="text-lg">{{ analysis.sintese.rr_ratio || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <!-- Operational Levels -->
      <div v-if="analysis.niveis_operacionais" class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Operational Levels</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">Entry</div>
            <div class="text-lg font-bold">${{ analysis.niveis_operacionais.entry_price?.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Stop Loss</div>
            <div class="text-lg font-bold text-red-400">
              ${{ analysis.niveis_operacionais.stop_loss?.toFixed(2) }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">TP1</div>
            <div class="text-lg font-bold text-green-400">
              ${{ analysis.niveis_operacionais.tp1?.toFixed(2) }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">TP2</div>
            <div class="text-lg font-bold text-green-400">
              ${{ analysis.niveis_operacionais.tp2?.toFixed(2) }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">TP3</div>
            <div class="text-lg font-bold text-green-400">
              ${{ analysis.niveis_operacionais.tp3?.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Context -->
      <div v-if="analysis.contexto" class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Market Context</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">Regime</div>
            <div class="text-lg">{{ analysis.contexto.regime }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Volatility</div>
            <div class="text-lg">{{ analysis.contexto.volatilidade }}%</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Trend (Short)</div>
            <div class="text-lg">{{ analysis.contexto.tendencia_curta }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Trend (Long)</div>
            <div class="text-lg">{{ analysis.contexto.tendencia_longa }}</div>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div v-if="analysis.indicadores" class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Indicators</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">RSI</div>
            <div class="text-lg">{{ analysis.indicadores.rsi?.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">EMA 8</div>
            <div class="text-lg">${{ analysis.indicadores.ema8?.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">EMA 21</div>
            <div class="text-lg">${{ analysis.indicadores.ema21?.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Price</div>
            <div class="text-lg">${{ analysis.indicadores.preco?.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-400">
      Selecione um símbolo e clique em "Analyze"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const symbol = ref('BTCUSDT')
const timeframe = ref('1h')
const loading = ref(false)
const error = ref<string | null>(null)
const analysis = ref<any>(null)

const loadAnalysis = async () => {
  loading.value = true
  error.value = null
  
  try {
    analysis.value = await api.analyze(symbol.value, timeframe.value)
  } catch (err: any) {
    error.value = err.message || 'Erro ao executar análise'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.analysis-view {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}
</style>
