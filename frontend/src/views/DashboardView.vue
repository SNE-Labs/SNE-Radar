<template>
  <Layout>
    <div class="dashboard-view">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-mono font-bold mb-2 glow-green">Dashboard</h1>
        <p class="text-gray-400 font-mono">Análise de mercado em tempo real</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard v-for="i in 4" :key="i" />
        </div>
        <SkeletonCard />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard v-for="i in 3" :key="i" />
        </div>
      </div>

      <!-- Error -->
      <TerminalCard v-else-if="error" class="border-terminal-error">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-2 h-2 rounded-full bg-terminal-error animate-pulse"></div>
          <p class="text-terminal-error font-mono">{{ error }}</p>
        </div>
        <TerminalButton @click="loadData" variant="danger" size="sm">
          Tentar Novamente
        </TerminalButton>
      </TerminalCard>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- Global Metrics -->
        <div v-if="globalMetrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Market Cap"
            :value="globalMetrics.market_cap"
            format="currency"
          />
          
          <MetricCard
            label="BTC Dominance"
            :value="globalMetrics.btc_dominance"
            format="percent"
          />
          
          <MetricCard
            label="ETH Dominance"
            :value="globalMetrics.eth_dominance"
            format="percent"
          />
          
          <TerminalCard>
            <div class="text-sm text-gray-400 uppercase tracking-wider mb-2">Market Breadth</div>
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Gainers</div>
                <div class="text-2xl font-mono font-bold text-terminal-success">
                  {{ globalMetrics.breadth?.gainers || 0 }}
                </div>
              </div>
              <div class="w-px h-8 bg-terminal-border"></div>
              <div class="flex-1">
                <div class="text-xs text-gray-500 mb-1">Losers</div>
                <div class="text-2xl font-mono font-bold text-terminal-error">
                  {{ globalMetrics.breadth?.losers || 0 }}
                </div>
              </div>
            </div>
          </TerminalCard>
        </div>

        <!-- System Status -->
        <TerminalCard v-if="systemStatus">
          <h2 class="text-xl font-mono font-bold mb-6 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-terminal-success animate-pulse"></span>
            System Status
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Circuit Breakers</div>
              <div class="text-lg font-mono text-terminal-success">All OK</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">API Calls</div>
              <div class="text-lg font-mono">{{ systemStatus.api_call_counts?.binance || 0 }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Rate Limits</div>
              <div class="text-lg font-mono">{{ systemStatus.rate_limits?.binance || 0 }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Update</div>
              <div class="text-sm font-mono text-gray-400">{{ formatTimestamp(systemStatus.timestamp) }}</div>
            </div>
          </div>
        </TerminalCard>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link to="/chart" class="interactive">
            <TerminalCard hover class="fade-in">
              <div class="flex items-start justify-between mb-4">
                <ChartBar class="w-8 h-8 text-terminal-accent" />
                <ArrowRight class="w-4 h-4 text-terminal-accent" />
              </div>
              <h3 class="text-xl font-mono font-bold mb-2">Charts</h3>
              <p class="text-sm text-gray-400">Visualize gráficos interativos com indicadores técnicos avançados</p>
            </TerminalCard>
          </router-link>
          
          <router-link to="/analysis" class="interactive">
            <TerminalCard hover class="fade-in">
              <div class="flex items-start justify-between mb-4">
                <Microscope class="w-8 h-8 text-terminal-info" />
                <ArrowRight class="w-4 h-4 text-terminal-accent" />
              </div>
              <h3 class="text-xl font-mono font-bold mb-2">Analysis</h3>
              <p class="text-sm text-gray-400">Análise técnica completa com níveis operacionais</p>
            </TerminalCard>
          </router-link>
          
          <TerminalCard class="fade-in">
            <div class="flex items-start justify-between mb-4">
              <Zap class="w-8 h-8 text-terminal-warning" />
            </div>
            <h3 class="text-xl font-mono font-bold mb-2">Quick Signal</h3>
            <p class="text-sm text-gray-400 mb-4">Obtenha um sinal rápido para BTC</p>
            <TerminalButton
              @click="loadQuickSignal"
              :disabled="loadingSignal"
              variant="primary"
              size="sm"
              class="w-full"
            >
              {{ loadingSignal ? 'Loading...' : 'Get BTC Signal' }}
            </TerminalButton>
            <div v-if="quickSignal" class="mt-4 pt-4 border-t border-terminal-border">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-500 uppercase">Signal</span>
                <span
                  :class="[
                    'text-2xl font-mono font-bold',
                    quickSignal.signal === 'BUY' ? 'text-terminal-success' : '',
                    quickSignal.signal === 'SELL' ? 'text-terminal-error' : '',
                    quickSignal.signal === 'NEUTRAL' ? 'text-gray-400' : ''
                  ]"
                >
                  {{ quickSignal.signal }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 uppercase">Score</span>
                <span class="text-sm font-mono text-terminal-accent">
                  {{ quickSignal.score }}/10
                </span>
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChartBar, Microscope, Zap, ArrowRight } from 'lucide-vue-next'
import api from '@/services/api'
import Layout from '@/components/Layout.vue'
import TerminalCard from '@/components/TerminalCard.vue'
import TerminalButton from '@/components/TerminalButton.vue'
import MetricCard from '@/components/MetricCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

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
    globalMetrics.value = await api.getGlobalMetrics()
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

const formatTimestamp = (ts: number | null | undefined): string => {
  if (!ts) return 'N/A'
  return new Date(ts * 1000).toLocaleTimeString('pt-BR')
}

onMounted(() => {
  loadData()
  setInterval(() => {
    loadData()
  }, 60000)
})
</script>

<style scoped>
.dashboard-view {
  min-height: calc(100vh - 200px);
}
</style>
