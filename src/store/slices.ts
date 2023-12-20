import { createWalletSlice } from 'app/pages/CreateWalletPage/slice'
import { fiatOnrampSlice } from 'app/pages/FiatOnrampPage/slice'
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

export const rootSlices = {
  account: accountSlice,
  contacts: contactsSlice,
  evmAccounts: evmAccountsSlice,
  createWallet: createWalletSlice,
  fiatOnramp: fiatOnrampSlice,
  fatalError: fatalErrorSlice,
  importAccounts: importAccountsSlice,
  network: networkSlice,
  paraTimes: paraTimesSlice,
  staking: stakingSlice,
  theme: themeSlice,
  transaction: transactionSlice,
  wallet: walletSlice,
  persist: persistSlice,
}
