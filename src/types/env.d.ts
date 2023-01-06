/// <reference types="vite/client" />

// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  REACT_APP_BACKEND: 'oasismonitor' | 'oasisscan'
  REACT_APP_LOCALNET: '1' | undefined
  REACT_APP_E2E_TEST: '1' | undefined
  NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
