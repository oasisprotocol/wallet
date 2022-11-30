declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_BACKEND: 'oasismonitor' | 'oasisscan'
    REACT_APP_LOCALNET: '1' | undefined
    REACT_APP_E2E_TEST: '1' | undefined
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
