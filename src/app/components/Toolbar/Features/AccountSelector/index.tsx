/**
 *
 * AccountSelector
 *
 */
import { walletActions } from 'app/state/wallet'
import { selectAddress, selectWallets } from 'app/state/wallet/selectors'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ManageableAccount } from '../Account/ManageableAccount'

interface Props {
  closeHandler: () => any
}

export const AccountSelector = memo((props: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const wallets = useSelector(selectWallets)
  const activeAddress = useSelector(selectAddress)

  const switchAccount = (address: string) => {
    dispatch(walletActions.selectWallet(address))
    props.closeHandler()
  }

  const accounts = Object.values(wallets).map(wallet => (
    <ManageableAccount
      key={wallet.address}
      wallet={wallet}
      onClick={switchAccount}
      isActive={wallet.address === activeAddress}
    />
  ))

  return (
    <>
      <Box
        gap="small"
        pad={{ vertical: 'medium', right: 'small' }}
        overflow={{ vertical: 'auto' }}
        height={{ max: '400px' }}
      >
        {accounts}
      </Box>
      <Box align="end" pad={{ top: 'medium' }}>
        <Button primary label={t('toolbar.wallets.select', 'Select')} onClick={props.closeHandler} />
      </Box>
    </>
  )
})
