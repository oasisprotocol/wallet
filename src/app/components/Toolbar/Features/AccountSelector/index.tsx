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
import { Box, Button, CheckBox, ResponsiveContext, Spinner, Text } from 'grommet'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

interface Props {
  closeHandler: () => any
}

interface AccountProps {
  address: string
  balance?: StringifiedBigInt
  type: WalletType
  onClick: (address: string) => void
  details?: string
  isActive: boolean
  displayCheckbox?: boolean
  displayIndex?: boolean
}

export const Account = memo((props: AccountProps) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)

  const address =
    size === 'small' ? (
      <ShortAddress address={props.address} />
    ) : (
      <Text style={{ fontFamily: 'Roboto mono' }}>
        <PrettyAddress address={props.address} />
      </Text>
    )

  const walletTypes: { [type in WalletType]: string } = {
    [WalletType.Ledger]: t('toolbar.wallets.type.ledger', 'Ledger'),
    [WalletType.Mnemonic]: t('toolbar.wallets.type.mnemonic', 'Mnemonic'),
    [WalletType.PrivateKey]: t('toolbar.wallets.type.privateKey', 'Private key'),
  }

  const { details } = props

  const index = details ? details.split('/').at(-1) : '?'

  return (
    <Box
      data-testid="account-choice"
      round="5px"
      background={props.isActive ? 'neutral-2' : undefined}
      border={{ color: props.isActive ? 'neutral-2' : 'brand' }}
      pad="small"
      flex="grow"
      fill="horizontal"
      onClick={() => {
        props.onClick(props.address)
      }}
      hoverIndicator={{ background: 'brand' }}
      direction="row"
    >
      {props.displayCheckbox && (
        <Box alignSelf="center" pad={{ left: 'small', right: 'medium' }}>
          <CheckBox checked={props.isActive} />
        </Box>
      )}
      {props.displayIndex && (
        <Box alignSelf="center" pad={{ left: 'small', right: 'small' }} style={{ minWidth: '2.5em' }}>
          <Text weight="bold" style={{ width: '2em' }}>
            {index}
          </Text>
        </Box>
      )}
      <Box flex="grow">
        <Box>
          <Text weight="bold">{address}</Text>
        </Box>
        <Box direction="row-responsive">
          <Box align="start" flex="grow" direction="row">
            {walletTypes[props.type]} {props.details && <Text size="small">({props.details})</Text>}
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
      balance={wallet.balance ? wallet.balance.available : undefined} // TODO: get total balance
      type={wallet.type}
      onClick={switchAccount}
      isActive={wallet.address === activeAddress}
      details={wallet.path?.join('/')}
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
