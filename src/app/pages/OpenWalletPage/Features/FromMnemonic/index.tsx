import { MnemonicValidation } from 'app/components/MnemonicValidation'
import { walletActions } from 'app/state/wallet'
import { useDispatch } from 'react-redux'

interface Props {}

export function FromMnemonic(props: Props) {
  const dispatch = useDispatch()

  return (
    <MnemonicValidation
      successHandler={mnemonic => dispatch(walletActions.openWalletFromMnemonic(mnemonic))}
    ></MnemonicValidation>
  )
}
