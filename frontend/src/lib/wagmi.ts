import { createConfig, http } from 'wagmi'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'
import { scrollSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [scrollSepolia],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fcc6bba6f1de962d911bb5b5c3dba68',
      showQrModal: true,
    }),
    injected(),
    metaMask(),
  ],
  transports: {
    [scrollSepolia.id]: http(import.meta.env.VITE_SCROLL_RPC_URL || 'https://sepolia-rpc.scroll.io'),
  },
})

