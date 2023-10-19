export interface EvmAccount {
  ethPrivateKey: string
  ethAddress: string
}

/* --- STATE --- */
export interface EvmAccounts {
  [ethAddress: string]: EvmAccount
}
