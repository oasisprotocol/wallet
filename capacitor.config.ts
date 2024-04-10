import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.oasisprotocol.wallet',
  appName: 'Oasis ROSE Wallet',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
}

export default config
