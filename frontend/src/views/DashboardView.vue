<template>
  <div class="dashboard p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">SNE Radar Dashboard</h1>
      <p class="text-gray-400">Análise de mercado em tempo real</p>
    </div>

    <!-- Status -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <p class="mt-2 text-gray-400">Carregando...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
      <button 
        @click="loadData"
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Tentar Novamente
      </button>
    </div>

    <!-- Global Metrics -->
    <div v-if="globalMetrics" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">Market Cap</div>
        <div class="text-2xl font-bold">
          ${{ formatNumber(globalMetrics.market_cap) }}
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">BTC Dominance</div>
        <div class="text-2xl font-bold">{{ globalMetrics.btc_dominance?.toFixed(2) }}%</div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">ETH Dominance</div>
        <div class="text-2xl font-bold">{{ globalMetrics.eth_dominance?.toFixed(2) }}%</div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">Market Breadth</div>
        <div class="text-sm">
          <span class="text-green-400">↑ {{ globalMetrics.breadth?.gainers }}</span>
          <span class="text-gray-500 mx-2">/</span>
          <span class="text-red-400">↓ {{ globalMetrics.breadth?.losers }}</span>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div v-if="systemStatus" class="bg-gray-800 rounded-lg p-4 mb-8">
      <h2 class="text-xl font-bold mb-4">System Status</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div class="text-sm text-gray-400">Circuit Breakers</div>
          <div class="text-green-400">All OK</div>
        </div>
        <div>
          <div class="text-sm text-gray-400">API Calls</div>
          <div>{{ systemStatus.api_call_counts?.binance || 0 }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400">Rate Limits</div>
          <div>{{ systemStatus.rate_limits?.binance || 0 }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400">Last Update</div>
          <div class="text-xs">{{ formatTimestamp(systemStatus.timestamp) }}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link
        to="/chart"
        class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition"
      >
        <h3 class="text-xl font-bold mb-2">📊 Charts</h3>
        <p class="text-gray-400">Visualize gráficos interativos</p>
      </router-link>
      
      <router-link
        to="/analysis"
        class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition"
      >
        <h3 class="text-xl font-bold mb-2">🔬 Analysis</h3>
        <p class="text-gray-400">Análise técnica completa</p>
      </router-link>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-xl font-bold mb-2">⚡ Quick Signal</h3>
        <button
          @click="loadQuickSignal"
          :disabled="loadingSignal"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loadingSignal ? 'Loading...' : 'Get BTC Signal' }}
        </button>
        <div v-if="quickSignal" class="mt-4">
          <div class="text-2xl font-bold" :class="{
            'text-green-400': quickSignal.signal === 'BUY',
            'text-red-400': quickSignal.signal === 'SELL',
            'text-gray-400': quickSignal.signal === 'NEUTRAL'
          }">
            {{ quickSignal.signal }}
          </div>
          <div class="text-sm text-gray-400">Score: {{ quickSignal.score }}/10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const error = ref<string | null>(null)
const globalMetrics = ref<any>(null)
const systemStatus = ref<any>(null)
const quickSignal = ref<any>(null)
const loadingSignal = ref(false)

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Carregar métricas globais
    globalMetrics.value = await api.getGlobalMetrics()
    
    // Carregar status do sistema
    systemStatus.value = await api.getSystemStatus()
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar dados'
  } finally {
    loading.value = false
  }
}

const loadQuickSignal = async () => {
  loadingSignal.value = true
  try {
    quickSignal.value = await api.getSignal('BTCUSDT', '1h')
  } catch (err: any) {
    console.error('Erro ao carregar sinal:', err)
  } finally {
    loadingSignal.value = false
  }
}

const formatNumber = (num: number | null | undefined): string => {
  if (!num) return '0'
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  return num.toLocaleString()
}

const formatTimestamp = (ts: number | null | undefined): string => {
  if (!ts) return 'N/A'
  return new Date(ts * 1000).toLocaleTimeString()
}

onMounted(() => {
  loadData()
  
  // Auto-refresh a cada 60 segundos
  setInterval(() => {
    loadData()
  }, 60000)
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}
</style>
