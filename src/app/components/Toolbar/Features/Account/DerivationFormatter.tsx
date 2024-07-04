import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { WalletType } from 'app/state/wallet/types'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { MuiUsbIcon } from 'styles/theme/icons/mui-icons/MuiUsbIcon'
import { MuiBluetoothIcon } from 'styles/theme/icons/mui-icons/MuiBluetoothIcon'
import { MuiMarginIcon } from 'styles/theme/icons/mui-icons/MuiMarginIcon'
import { MuiVpnKeyIcon } from 'styles/theme/icons/mui-icons/MuiVpnKeyIcon'

export interface DerivationFormatterProps {
  type?: WalletType
  pathDisplay: string | undefined
}

const iconProps = {
  size: '20px',
  color: '#fff',
}

export const DerivationFormatter = (props: DerivationFormatterProps) => {
  const walletTypes: { [type in WalletType]: ReactNode } = {
    [WalletType.UsbLedger]: (
      <Circle color="#0092F6">
        <MuiUsbIcon {...iconProps} />
      </Circle>
    ),
    [WalletType.BleLedger]: (
      <Circle color="#3333c4">
        <MuiBluetoothIcon {...iconProps} />
      </Circle>
    ),
    [WalletType.Mnemonic]: (
      <Circle color="#6665D8">
        <MuiMarginIcon {...iconProps} />
      </Circle>
    ),
    [WalletType.PrivateKey]: (
      <Circle color="#0500E1">
        <MuiVpnKeyIcon {...iconProps} />
      </Circle>
    ),
  }
  return (
    <Box align="center" gap="xsmall" direction="row">
      {/* eslint-disable-next-line no-restricted-syntax -- children are not a plain text node */}
      {props.type && walletTypes[props.type]}
      {props.pathDisplay && <Text size="small">({props.pathDisplay})</Text>}
    </Box>
  )
}

const StyledCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
`

interface CircleProps {
  children: ReactNode
  color: string
}

const Circle: FC<CircleProps> = ({ color, children }) => {
  return <StyledCircle color={color}>{children}</StyledCircle>
}
