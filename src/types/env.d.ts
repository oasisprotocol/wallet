type Backend = 'oasismonitor' | 'oasisscan' | 'oasisscanV2' | 'nexus'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      REACT_APP_BACKEND: Backend
      REACT_APP_TRANSAK_URL: string
      REACT_APP_TRANSAK_PARTNER_ID: string
      REACT_APP_LOCALNET: '1' | undefined
      REACT_APP_E2E_TEST: '1' | undefined
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }

  interface Window {
    REACT_APP_BACKEND: Backend
  }
}

export {}
