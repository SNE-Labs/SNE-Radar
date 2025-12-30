import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWallet, verifySession } from '../composables/useWallet'

export const useAuthStore = defineStore('auth', () => {
  const isInitialized = ref(false)
  const { address, isConnected, tier, isLoading, error } = useWallet

  // Inicializar verificação de sessão
  const initialize = async () => {
    if (isInitialized.value) return
    
    try {
      await verifySession()
      isInitialized.value = true
    } catch (err) {
      isInitialized.value = true // Marcar como inicializado mesmo em caso de erro
    }
  }

  return {
    address,
    isConnected,
    tier,
    isLoading,
    error,
    isInitialized,
    initialize
  }
})

