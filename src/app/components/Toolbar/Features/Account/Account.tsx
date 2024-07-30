import { AmountFormatter } from 'app/components/AmountFormatter'
import { PrettyAddress } from 'app/components/PrettyAddress'
import { ShortAddress } from 'app/components/ShortAddress'
import { Box } from 'grommet/es6/components/Box'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BalanceDetails } from '../../../../state/account/types'
import { Button } from 'grommet/es6/components/Button'
import { DerivationFormatter, DerivationFormatterProps } from './DerivationFormatter'
import styled, { ThemeContext } from 'styled-components'

const StyledManageButton = styled(Button)`
  border-radius: ${({ theme }) => theme.button?.border?.radius};
`
StyledManageButton.defaultProps = {
  color: { light: 'brand', dark: 'white' },
  size: 'small',
  primary: true,
  hoverIndicator: true,
}

export interface AccountProps {
  address: string
  balance: BalanceDetails | undefined
  onClick?: (address: string) => void
  path?: number[]
  isActive: boolean
  displayBalance: boolean
  displayCheckbox?: boolean
  displayAccountNumber?: boolean
  displayDerivation?: DerivationFormatterProps
  displayManageButton?: {
    onClickManage: (address: string) => void
  }
  name?: string
}

export const Account = memo((props: AccountProps) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const { dark } = useContext<any>(ThemeContext)

  const address =
    size === 'small' ? <ShortAddress address={props.address} /> : <PrettyAddress address={props.address} />

  const accountNumber = props.path ? props.path.at(-1) : '?'

  return (
    <Box
      data-testid="account-choice"
      round="5px"
      background={props.isActive ? 'control' : undefined}
      border={{ color: 'control' }}
      pad="small"
      flex={{ shrink: 0 }}
      role="checkbox"
      aria-checked={props.isActive}
      onClick={props.onClick ? () => props.onClick!(props.address) : undefined}
      hoverIndicator={!props.isActive && { color: 'active', dark: dark }}
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

      <Box fill="horizontal" gap={size === 'small' ? undefined : 'xsmall'}>
        {props.name && (
          <Box data-testid="account-name">
            <Text weight="bold">{props.name}</Text>
          </Box>
        )}
        <Box>
          <Text weight="bold">{address}</Text>
        </Box>
        <Box direction="row" gap="small" wrap>
          {props.displayManageButton && (
            <Box direction="row">
              <StyledManageButton
                label={t('toolbar.settings.manageAccount', 'Manage')}
                onClick={e => {
                  // TODO: clicking using Tab + Enter on Manage only triggers parent listener `props.onClick`.
                  props.displayManageButton?.onClickManage(props.address)
                  e.stopPropagation()
                }}
              />
            </Box>
          )}
          {props.displayDerivation && <DerivationFormatter {...props.displayDerivation} />}
          {props.displayBalance && (
            <Box height="24px" margin={{ left: 'auto' }} alignSelf="center">
              {props.balance ? <AmountFormatter amount={props.balance.total} /> : <Spinner />}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
})
