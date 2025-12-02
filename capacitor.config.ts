import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.oasis.wallet',
  appName: 'ROSE Wallet',
  webDir: 'build',
  android: {
    adjustMarginsForEdgeToEdge: 'force',
  },
  server: {
    androidScheme: 'https',
  },
}

export default config
