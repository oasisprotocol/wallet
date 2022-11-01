import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MnemonicValidation } from 'app/components/MnemonicValidation'
import { importAccountsActions } from 'app/state/importaccounts'
import { ImportAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/ImportAccountsSelectionModal'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { WalletType } from 'app/state/wallet/types'

export function FromMnemonic() {
  const dispatch = useDispatch()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)
  const successHandler = (mnemonic: string) => {
    dispatch(importAccountsActions.enumerateAccountsFromMnemonic(mnemonic))
  }
  return (
    <>
      <MnemonicValidation successHandler={successHandler} />
      {showAccountsSelectionModal && (
        <ImportAccountsSelectionModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          type={WalletType.Mnemonic}
        />
      )}
    </>
  )
}
