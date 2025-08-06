import { ThemeState } from 'styles/theme/slice/types'
import { WalletState } from 'app/state/wallet/types'
import { CreateWalletState } from 'app/pages/CreateWalletPage/slice/types'
import { AccountState } from 'app/state/account/types'
import { ContactsState } from 'app/state/contacts/types'
import { EvmAccounts } from 'app/state/evmAccounts/types'
import { NetworkState } from 'app/state/network/types'
import { TransactionState } from 'app/state/transaction/types'
import { ImportAccountsState } from 'app/state/importaccounts/types'
import { ParaTimesState } from 'app/state/paratimes/types'
import { StakingState } from 'app/state/staking/types'
import { FatalErrorState } from 'app/state/fatalerror/types'
import { PersistState } from 'app/state/persist/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { receivePersistedRootState } from 'app/state/persist'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { receiveInitialTabSyncState, whitelistTabSyncActions } from 'app/state/persist/syncTabs'

export interface RootState {
  /** Stored slices, see {@link receivePersistedRootState} */
  contacts: ContactsState
  evmAccounts: EvmAccounts
  theme: ThemeState
  wallet: WalletState
  network: NetworkState
  /** Synced slices, see {@link receiveInitialTabSyncState} {@link whitelistTabSyncActions} */
  persist: PersistState
  /** Not synced or stored */
  account: AccountState
  createWallet: CreateWalletState
  transaction: TransactionState
  importAccounts: ImportAccountsState
  paraTimes: ParaTimesState
  staking: StakingState
  fatalError: FatalErrorState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
export type DeepPartialRootState = DeepPartial<RootState>
