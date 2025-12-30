import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const SIWE_DOMAIN = import.meta.env.VITE_SIWE_DOMAIN || 'radar.snelabs.space'
const SIWE_ORIGIN = import.meta.env.VITE_SIWE_ORIGIN || 'https://radar.snelabs.space'
const CHAIN_ID = 534351 // Scroll Sepolia

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const [tier, setTier] = useState<'free' | 'premium' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar autenticação ao montar
  useEffect(() => {
    if (isConnected && address) {
      checkAuth()
    }
  }, [isConnected, address])

  const checkAuth = async () => {
    if (!address) return false

    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include',
      })

      if (response.ok) {
        const { tier: verifiedTier } = await response.json()
        setTier(verifiedTier || 'free')
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }

    setIsAuthenticated(false)
    return false
  }

  const signIn = async () => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    try {
      // 1. Obter nonce
      const nonceRes = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address }),
      })

      if (!nonceRes.ok) {
        throw new Error('Failed to get nonce')
      }

      const { nonce } = await nonceRes.json()

      // 2. Criar mensagem SIWE
      const message = new SiweMessage({
        domain: SIWE_DOMAIN,
        address,
        statement: 'Sign in to SNE Radar',
        uri: SIWE_ORIGIN,
        version: '1',
        chainId: CHAIN_ID,
        nonce,
        issuedAt: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
      })

      const messageToSign = message.prepareMessage()

      // 3. Solicitar assinatura
      const signature = await signMessageAsync({ message: messageToSign })

      // 4. Autenticar via backend
      const authRes = await fetch('/api/auth/siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: messageToSign,
          signature,
        }),
      })

      if (!authRes.ok) {
        const error = await authRes.json()
        throw new Error(error.error || 'Authentication failed')
      }

      const { license } = await authRes.json()
      setTier(license.tier || 'free')
      setIsAuthenticated(true)

      toast.success('Autenticado com sucesso!')
      return { license }
    } catch (error: any) {
      console.error('SIWE error:', error)
      toast.error(error.message || 'Erro ao autenticar')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Desconectar wallet
    disconnect()

    // Fazer logout no backend
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    setTier('free')
    setIsAuthenticated(false)
    toast.info('Desconectado')
  }

  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectorId
        ? connectors.find((c) => c.id === connectorId)
        : connectors[0] // WalletConnect por padrão

      if (!connector) {
        throw new Error('Connector not found')
      }

      await connect({ connector })
      toast.success('Wallet conectada!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao conectar wallet')
      throw error
    }
  }

  return {
    address,
    isConnected,
    isAuthenticated,
    tier,
    loading,
    connect: connectWallet,
    disconnect: signOut,
    signIn,
    checkAuth,
    connectors,
  }
}

