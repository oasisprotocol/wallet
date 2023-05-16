/**
 *
 * AccountSelector
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { PrettyAddress } from 'app/components/PrettyAddress'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { ShortAddress } from 'app/components/ShortAddress'
import { ModalHeader } from 'app/components/Header'
import { walletActions } from 'app/state/wallet'
import { selectAddress, selectWallets } from 'app/state/wallet/selectors'
import { WalletType } from 'app/state/wallet/types'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

interface Props {
  closeHandler: () => any
}

interface AccountProps {
  address: string
  balance: StringifiedBigInt | null
  type: WalletType
  onClick: (address: string) => void
  path?: number[]
  pathDisplay?: string
  isActive: boolean
  displayCheckbox?: boolean
  displayAccountNumber?: boolean
}

export const Account = memo((props: AccountProps) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)

  const address =
    size === 'small' ? <ShortAddress address={props.address} /> : <PrettyAddress address={props.address} />

  const walletTypes: { [type in WalletType]: string } = {
    [WalletType.Ledger]: t('toolbar.wallets.type.ledger', 'Ledger'),
    [WalletType.Mnemonic]: t('toolbar.wallets.type.mnemonic', 'Mnemonic'),
    [WalletType.PrivateKey]: t('toolbar.wallets.type.privateKey', 'Private key'),
  }

  const accountNumber = props.path ? props.path.at(-1) : '?'

  return (
    <Box
      data-testid="account-choice"
      round="5px"
      background={props.isActive ? 'neutral-2' : undefined}
      border={{ color: props.isActive ? 'neutral-2' : 'brand' }}
      pad="small"
      flex="grow"
      fill="horizontal"
      role="checkbox"
      aria-checked={props.isActive}
      onClick={() => {
        props.onClick(props.address)
      }}
      hoverIndicator={{ background: 'brand' }}
      direction="row"
    >
      {props.displayCheckbox && (
        <Box alignSelf="center" pad={{ left: 'small', right: 'medium' }}>
          <CheckBox checked={props.isActive} hidden />
        </Box>
      )}
      {props.displayAccountNumber && (
        <Box alignSelf="center" pad={{ left: 'small', right: 'small' }} style={{ minWidth: '2.5em' }}>
          <Text weight="bold" style={{ width: '2em' }}>
            {accountNumber}
          </Text>
        </Box>
      )}
      <Box flex="grow" gap={size === 'small' ? undefined : 'xsmall'}>
        <Box>
          <Text weight="bold">{address}</Text>
        </Box>
        <Box direction="row-responsive">
          <Box align="start" flex="grow" direction="row">
            {walletTypes[props.type]} {props.pathDisplay && <Text size="small">({props.pathDisplay})</Text>}
          </Box>
          <Box height={'24px'}>
            {props.balance ? <AmountFormatter amount={props.balance} /> : <Spinner />}
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

export const AccountSelector = memo((props: Props) => {
  const size = useContext(ResponsiveContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const wallets = useSelector(selectWallets)
  const activeAddress = useSelector(selectAddress)

  const switchAccount = (address: string) => {
    dispatch(walletActions.selectWallet(address))
    props.closeHandler()
  }

  const accounts = Object.values(wallets).map(wallet => (
    <Account
      key={wallet.address}
      address={wallet.address}
      balance={wallet.balance?.total}
      type={wallet.type}
      onClick={switchAccount}
      isActive={wallet.address === activeAddress}
      path={wallet.path}
      pathDisplay={wallet.pathDisplay}
    />
  ))

  return (
    <ResponsiveLayer
      onClickOutside={props.closeHandler}
      onEsc={props.closeHandler}
      animation="slide"
      background="background-front"
      modal
    >
      <Box margin="medium" width={size === 'small' ? 'auto' : '700px'}>
        <ModalHeader>{t('toolbar.wallets.switchOtherWallet', 'Switch to another account')}</ModalHeader>
        <Box
          gap="small"
          pad={{ vertical: 'medium', right: 'small' }}
          overflow={{ vertical: 'auto' }}
          height={{ max: '400px' }}
        >
          {accounts}
        </Box>
        <Box align="end" pad={{ top: 'medium' }}>
          <Button primary label={t('toolbar.wallets.close', 'Close')} onClick={props.closeHandler} />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
})
