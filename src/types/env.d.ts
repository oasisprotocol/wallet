declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_BACKEND: 'oasismonitor' | 'oasisscan'
    REACT_APP_BYPASS_LOCAL: '1' | undefined
    EXTENSION: 'true' | undefined
  }
}
