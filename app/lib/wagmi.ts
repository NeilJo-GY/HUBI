import { webSocket, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: webSocket('wss://sepolia.infura.io/ws/v3/fb014fa2879d4f8394654bbb3b594012'),
  },
})