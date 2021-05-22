/* --- STATE --- */
export interface FatalErrorPayload {
  message: string
  stack?: string
  sagaStack?: string
}

export interface FatalErrorState {
  error?: FatalErrorPayload
}
