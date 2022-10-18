// import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
import { ThemeState } from 'styles/theme/slice/types'
import { WalletState } from 'app/state/wallet/types'
import { CreateWalletState } from 'app/pages/CreateWalletPage/slice/types'
import { AccountState } from 'app/state/account/types'
import { NetworkState } from 'app/state/network/types'
import { TransactionState } from 'app/state/transaction/types'
import { ImportAccountsState } from 'app/state/importaccounts/types'
import { ParaTimesState } from 'app/state/paratimes/types'
import { StakingState } from 'app/state/staking/types'
import { FatalErrorState } from 'app/state/fatalerror/types'
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface RootState {
  theme: ThemeState
  wallet: WalletState
  createWallet: CreateWalletState
  account: AccountState
  network: NetworkState
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
