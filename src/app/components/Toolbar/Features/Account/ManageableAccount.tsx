import { useState } from 'react'
import { Account } from './Account'
import { ManageableAccountDetails } from './ManageableAccountDetails'
import { Wallet } from '../../../../state/wallet/types'

export const ManageableAccount = ({
  editHandler,
  wallet,
  isActive,
  deleteWallet,
  selectWallet,
}: {
  editHandler: (name: string) => void
  wallet: Wallet
  isActive: boolean
  deleteWallet?: (address: string) => void
  selectWallet: (address: string) => void
}) => {
  const [layerVisibility, setLayerVisibility] = useState(false)
  const handleDelete = deleteWallet
    ? (address: string) => {
        deleteWallet(address)
        setLayerVisibility(false)
      }
    : undefined

  return (
    <>
      <Account
        address={wallet.address}
        balance={wallet.balance}
        onClick={selectWallet}
        isActive={isActive}
        path={wallet.path}
        displayBalance={true}
        displayManageButton={{
          onClickManage: () => setLayerVisibility(true),
        }}
        name={wallet.name}
      />
      {layerVisibility && (
        <ManageableAccountDetails
          closeHandler={() => setLayerVisibility(false)}
          deleteAccount={handleDelete}
          editHandler={editHandler}
          wallet={wallet}
        />
      )}
    </>
  )
}
