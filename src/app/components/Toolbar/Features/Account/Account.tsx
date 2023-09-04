import { AmountFormatter } from 'app/components/AmountFormatter'
import { PrettyAddress } from 'app/components/PrettyAddress'
import { ShortAddress } from 'app/components/ShortAddress'
import { WalletType } from 'app/state/wallet/types'
import { Box } from 'grommet/es6/components/Box'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BalanceDetails } from '../../../../state/account/types'

interface AccountProps {
  address: string
  balance: BalanceDetails | undefined
  onClick: (address: string) => void
  path?: number[]
  isActive: boolean
  displayCheckbox?: boolean
  displayAccountNumber?: boolean
  displayDerivation?: {
    type: WalletType
    pathDisplay: string | undefined
  }
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
          <Box flex="grow">
            {props.displayDerivation && (
              <Box align="start" direction="row">
                {walletTypes[props.displayDerivation.type]}{' '}
                {props.displayDerivation.pathDisplay && (
                  <Text size="small">({props.displayDerivation.pathDisplay})</Text>
                )}
              </Box>
            )}
          </Box>
          <Box height={'24px'}>
            {props.balance ? <AmountFormatter amount={props.balance.total} /> : <Spinner />}
          </Box>
        </Box>
      </Box>
    </Box>
  )
})
