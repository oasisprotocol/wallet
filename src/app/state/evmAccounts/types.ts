/* --- STATE --- */
export interface EvmAccounts {
  [ethAddress: string]: {
    ethPrivateKey: string
    ethAddress: string
  }
}
