<template>
  <Layout>
    <div class="home-view terminal-grid min-h-[80vh] flex items-center">
      <div class="w-full max-w-4xl mx-auto text-center">
        <!-- Hero Section -->
        <div class="mb-12">
          <div class="inline-block mb-6">
            <div class="w-24 h-24 border-4 border-terminal-accent rounded-lg flex items-center justify-center mx-auto mb-6 animate-glow">
              <span class="text-4xl font-mono font-bold text-terminal-accent">SNE</span>
            </div>
          </div>
          
          <h1 class="text-6xl md:text-7xl font-mono font-bold mb-6 glow-green">
            SNE RADAR
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-400 mb-4 font-mono">
            Sistema de Análise Técnica Avançada
          </p>
          
          <p class="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Análise técnica profissional com inteligência artificial, 
            níveis operacionais precisos e visualizações interativas em tempo real.
          </p>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <router-link to="/dashboard">
            <TerminalButton size="lg" variant="primary" class="w-full sm:w-auto">
              Acessar Dashboard
            </TerminalButton>
          </router-link>
          
          <router-link to="/analysis">
            <TerminalButton size="lg" variant="secondary" class="w-full sm:w-auto">
              Análise Completa
            </TerminalButton>
          </router-link>
        </div>
        
        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <TerminalCard class="fade-in">
            <ChartBar class="w-8 h-8 text-terminal-accent mb-4" />
            <h3 class="text-xl font-mono font-bold mb-2">Gráficos Interativos</h3>
            <p class="text-sm text-gray-400">
              TradingView Lightweight Charts com indicadores técnicos avançados
            </p>
          </TerminalCard>
          
          <TerminalCard class="fade-in">
            <Brain class="w-8 h-8 text-terminal-purple mb-4" />
            <h3 class="text-xl font-mono font-bold mb-2">IA & ML</h3>
            <p class="text-sm text-gray-400">
              Motor de análise com machine learning e padrões reconhecidos
            </p>
          </TerminalCard>
          
          <TerminalCard class="fade-in">
            <Zap class="w-8 h-8 text-terminal-warning mb-4" />
            <h3 class="text-xl font-mono font-bold mb-2">Tempo Real</h3>
            <p class="text-sm text-gray-400">
              Atualizações em tempo real via WebSocket e análise contínua
            </p>
          </TerminalCard>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <div class="text-center">
            <div class="text-3xl font-mono font-bold text-terminal-accent mb-2">100+</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Indicadores</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-mono font-bold text-terminal-accent mb-2">24/7</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Monitoramento</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-mono font-bold text-terminal-accent mb-2">99.9%</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-mono font-bold text-terminal-accent mb-2">&lt;100ms</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Latência</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ChartBar, Brain, Zap } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import TerminalButton from '@/components/TerminalButton.vue'
import TerminalCard from '@/components/TerminalCard.vue'
</script>

<style scoped>
.home-view {
  position: relative;
}
</style>
