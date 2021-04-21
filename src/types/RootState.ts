// import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
import { ThemeState } from 'styles/theme/slice/types'
import { WalletState } from 'app/state/wallet/types'
import { CreateWalletState } from 'app/pages/CreateWalletPage/slice/types'
import { OpenWalletState } from 'app/pages/OpenWalletPage/slice/types'
import { AccountState } from 'app/state/account/types'
import { NetworkState } from 'app/state/network/types'
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  theme?: ThemeState
  // githubRepoForm?: GithubRepoFormState;
  wallet?: WalletState
  createWallet?: CreateWalletState
  openWallet?: OpenWalletState
  account?: AccountState
  network?: NetworkState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
