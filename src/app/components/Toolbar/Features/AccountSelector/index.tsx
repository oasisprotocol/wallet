/**
 *
 * AccountSelector
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { PrettyAddress } from 'app/components/PrettyAddress'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { ShortAddress } from 'app/components/ShortAddress'
import { walletActions } from 'app/state/wallet'
import { selectActiveWalletId, selectWallets } from 'app/state/wallet/selectors'
import { WalletType } from 'app/state/wallet/types'
import { Box, Button, CheckBox, Heading, ResponsiveContext, Text } from 'grommet'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

interface Props {
  closeHandler: () => any
}

interface AccountProps {
  index: number
  address: string
  balance: StringifiedBigInt
  type: WalletType
  onClick: (index: number) => void
  details?: string
  isActive: boolean
  displayCheckbox?: boolean
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
        props.onClick(props.index)
      }}
      hoverIndicator={{ background: 'brand' }}
      direction="row"
    >
      {props.displayCheckbox && (
        <Box alignSelf="center" pad={{ left: 'small', right: 'medium' }}>
          <CheckBox checked={props.isActive} />
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
          <Box>
            <AmountFormatter amount={props.balance} />
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
  const activeWalletIndex = useSelector(selectActiveWalletId)

  const switchAccount = (index: number) => {
    dispatch(walletActions.selectWallet(index))
    props.closeHandler()
  }

  const accounts = Object.values(wallets).map((wallet, index) => (
    <Account
      key={index}
      index={wallet.id}
      address={wallet.address}
      balance={wallet.balance.available} // TODO: get total balance
      type={wallet.type}
      onClick={switchAccount}
      isActive={wallet.id === activeWalletIndex}
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
      <Box pad={{ vertical: 'small' }} margin="medium" width={size === 'small' ? 'auto' : '700px'}>
        <Heading size="1" margin={{ vertical: 'small' }}>
          {t('toolbar.wallets.switchOtherWallet', 'Switch to another account')}
        </Heading>
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
