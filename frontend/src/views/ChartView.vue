<template>
  <div class="chart-view p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Chart Analysis</h1>
      <p class="text-gray-400">Gráficos interativos com indicadores técnicos</p>
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
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="loadChart"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Load Chart' }}
          </button>
        </div>
        
        <div v-if="chartData" class="flex items-end">
          <div class="text-sm">
            <div class="text-gray-400">Current Price</div>
            <div class="text-xl font-bold">${{ chartData.current_price?.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <p class="mt-2 text-gray-400">Carregando gráfico...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded p-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="chartData" class="bg-gray-800 rounded-lg p-4">
      <div id="chart-container" class="h-96"></div>
      
      <!-- Indicators Summary -->
      <div v-if="chartData.indicators" class="mt-6 grid grid-cols-3 gap-4">
        <div>
          <div class="text-sm text-gray-400">EMA 8</div>
          <div class="text-lg font-bold">
            ${{ chartData.indicators.ema8[chartData.indicators.ema8.length - 1]?.value?.toFixed(2) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-400">EMA 21</div>
          <div class="text-lg font-bold">
            ${{ chartData.indicators.ema21[chartData.indicators.ema21.length - 1]?.value?.toFixed(2) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-400">RSI</div>
          <div class="text-lg font-bold">
            {{ chartData.indicators.rsi[chartData.indicators.rsi.length - 1]?.value?.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-400">
      Selecione um símbolo e clique em "Load Chart"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { createChart, ColorType, IChartApi } from 'lightweight-charts'

const symbol = ref('BTCUSDT')
const timeframe = ref('1h')
const loading = ref(false)
const error = ref<string | null>(null)
const chartData = ref<any>(null)
let chart: IChartApi | null = null

const loadChart = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await api.getChartData(symbol.value, timeframe.value, 500)
    chartData.value = data
    
    // Renderizar gráfico (implementação básica)
    renderChart(data)
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar gráfico'
  } finally {
    loading.value = false
  }
}

const renderChart = (data: any) => {
  const container = document.getElementById('chart-container')
  if (!container) return
  
  // Limpar gráfico anterior
  if (chart) {
    chart.remove()
  }
  
  // Criar novo gráfico
  chart = createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: '#1a1a1a' },
      textColor: '#d1d5db'
    },
    width: container.clientWidth,
    height: 400,
    grid: {
      vertLines: { color: '#2a2a2a' },
      horzLines: { color: '#2a2a2a' }
    }
  })
  
  // Adicionar série de candles
  const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  })
  
  // Converter candles para formato Lightweight Charts
  const candles = data.candles.map((c: any) => ({
    time: c.time as any,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close
  }))
  
  candlestickSeries.setData(candles)
  
  // Adicionar EMA8
  if (data.indicators?.ema8?.length > 0) {
    const ema8Series = chart.addLineSeries({
      color: '#2196F3',
      lineWidth: 2,
      title: 'EMA 8'
    })
    ema8Series.setData(data.indicators.ema8.map((i: any) => ({
      time: i.time as any,
      value: i.value
    })))
  }
  
  // Adicionar EMA21
  if (data.indicators?.ema21?.length > 0) {
    const ema21Series = chart.addLineSeries({
      color: '#FF9800',
      lineWidth: 2,
      title: 'EMA 21'
    })
    ema21Series.setData(data.indicators.ema21.map((i: any) => ({
      time: i.time as any,
      value: i.value
    })))
  }
  
  chart.timeScale().fitContent()
}

watch([symbol, timeframe], () => {
  if (chartData.value) {
    loadChart()
  }
})

onMounted(() => {
  loadChart()
})
</script>

<style scoped>
.chart-view {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}
</style>
