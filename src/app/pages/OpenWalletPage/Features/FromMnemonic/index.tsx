import { MnemonicValidation } from 'app/components/MnemonicValidation'
import { useWalletSlice } from 'app/state/wallet'
import { useDispatch } from 'react-redux'

interface Props {}

export function FromMnemonic(props: Props) {
  const walletActions = useWalletSlice().actions
  const dispatch = useDispatch()

  return (
    <MnemonicValidation
      successHandler={mnemonic => dispatch(walletActions.openWalletFromMnemonic(mnemonic))}
    ></MnemonicValidation>
  )
}
