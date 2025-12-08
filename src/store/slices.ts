import { createWalletSlice } from 'app/pages/CreateWalletPage/slice'
import { accountSlice } from 'app/state/account'
import { fatalErrorSlice } from 'app/state/fatalerror'
import { importAccountsSlice } from 'app/state/importaccounts'
import { networkSlice } from 'app/state/network'
import { paraTimesSlice } from 'app/state/paratimes'
import { stakingSlice } from 'app/state/staking'
import { contactsSlice } from 'app/state/contacts'
import { evmAccountsSlice } from 'app/state/evmAccounts'
import { transactionSlice } from 'app/state/transaction'
import { walletSlice } from 'app/state/wallet'
import { themeSlice } from 'styles/theme/slice'
import { persistSlice } from 'app/state/persist'
import { settingsSlice } from 'app/state/settings/slice'

export const rootSlices = {
  account: accountSlice,
  contacts: contactsSlice,
  evmAccounts: evmAccountsSlice,
  createWallet: createWalletSlice,
  fatalError: fatalErrorSlice,
  importAccounts: importAccountsSlice,
  network: networkSlice,
  paraTimes: paraTimesSlice,
  settings: settingsSlice,
  staking: stakingSlice,
  theme: themeSlice,
  transaction: transactionSlice,
  wallet: walletSlice,
  persist: persistSlice,
}

export type AllActions = (typeof rootSlices)[keyof typeof rootSlices]['actions'] extends {
  [actionKey: string]: { type: infer T }
}
  ? T
  : never
