import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: process.env.VITE_WS_URL || 'http://localhost:5000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desabilitar em produção para melhor performance
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'web3': ['@wagmi/core', 'viem'],
          'charts': ['lightweight-charts']
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild', // Usa esbuild (já incluído no Vite) em vez de terser
    // terserOptions removido - usando esbuild
  },
  define: {
    // Garantir que variáveis de ambiente sejam substituídas em build time
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'https://sne-radar-api-xxxxx.run.app'
    )
  }
})

