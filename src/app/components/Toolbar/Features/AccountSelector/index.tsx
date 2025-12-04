/**
 *
 * AccountSelector
 *
 */
import { walletActions } from 'app/state/wallet'
import { selectAddress, selectWallets, selectHasOneAccount } from 'app/state/wallet/selectors'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ManageableAccount } from '../Account/ManageableAccount'
import { ScrollableContainer } from '../ScrollableContainer'
import { ButtonLink } from '../../../ButtonLink'
import { Add } from 'grommet-icons/es6/icons/Add'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'

interface Props {
  closeHandler: () => any
}

export const AccountSelector = memo((props: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const wallets = useSelector(selectWallets)
  const activeAddress = useSelector(selectAddress)
  const hasOneAccount = useSelector(selectHasOneAccount)
  const unlockedStatus = useSelector(selectUnlockedStatus)
  const unlockedProfile = unlockedStatus === 'unlockedProfile'
  const selectWallet = (address: string) => {
    dispatch(walletActions.selectWallet(address))
    props.closeHandler()
  }
  const isMobile = useContext(ResponsiveContext) === 'small'
  const accounts = Object.values(wallets).map(wallet => (
    <ManageableAccount
      closeHandler={props.closeHandler}
      editWallet={
        unlockedProfile
          ? (name: string) => {
              dispatch(walletActions.setWalletName({ address: wallet.address, name }))
            }
          : undefined
      }
      key={wallet.address}
      wallet={wallet}
      deleteWallet={
        hasOneAccount
          ? undefined
          : (address: string) => {
              dispatch(walletActions.deleteWallet(address))
              wallet.address === activeAddress && dispatch(walletActions.selectFirstWallet())
            }
      }
      selectWallet={selectWallet}
      isActive={wallet.address === activeAddress}
    />
  ))

  return (
    <Box flex="grow" justify="between" gap="medium" style={{ height: isMobile ? '0' : 'auto' }}>
      <ScrollableContainer>{accounts}</ScrollableContainer>
      <Box direction="row" justify="between" gap="medium" flex="grow" align="end">
        <ButtonLink
          icon={<Add a11yTitle={undefined} />}
          label={t('menu.addAccounts', 'Add accounts')}
          to="/"
          onClick={() => props.closeHandler()}
        />
        <Button primary label={t('toolbar.wallets.select', 'Select')} onClick={props.closeHandler} />
      </Box>
    </Box>
  )
})
