/**
 *
 * AddressBox
 *
 */
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { Notification } from 'grommet/es6/components/Notification'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { Edit } from 'grommet-icons/es6/icons/Edit'
import { memo, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Wallet } from 'app/state/wallet/types'
import { trimLongString } from '../ShortAddress/trimLongString'
import { PrettyAddress } from '../PrettyAddress'

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => normalizeColor('background-custom-2', theme)};
  border-width: 1px;
  color: ${({ theme }) => normalizeColor('text-custom', theme)};
`

interface AddressBoxProps {
  address: string
  border?: boolean
  children?: ReactNode
}

interface ContainerProps extends AddressBoxProps {
  copyToClipboard: 'icon' | 'button'
}

const Container = ({ address, border, children, copyToClipboard }: ContainerProps) => {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const hideNotification = () => setNotificationVisible(false)
  const copyAddress = () => {
    const wasCopied = copy(address)
    if (wasCopied) {
      setNotificationVisible(true)
    }
  }

  return (
    <Box
      direction="row"
      align="center"
      round="5px"
      pad={{ right: 'small' }}
      border={border && { color: 'brand' }}
    >
      <Box
        direction="row"
        align="center"
        border={{
          color: 'background-front-border',
          side: 'bottom',
        }}
        margin={{ right: 'xlarge' }}
      >
        {copyToClipboard === 'icon' && (
          <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address" />
        )}
        <div>{children}</div>
      </Box>

      {copyToClipboard === 'button' && (
        <StyledButton
          label={trimLongString(address, 8, 6)}
          onClick={() => copyAddress()}
          icon={<Copy size="18px" color="currentColor" />}
          data-testid="copy-address"
          reverse
        />
      )}
      {notificationVisible && (
        <Notification
          toast
          status={'normal'}
          title={t('account.addressCopied', 'Address copied.')}
          onClose={hideNotification}
        />
      )}
    </Box>
  )
}

export const AddressBox = memo((props: AddressBoxProps) => {
  return (
    <Container address={props.address} border={props.border} copyToClipboard="icon">
      <Text weight="bold" size="medium" wordBreak="break-word" style={{ flex: 1 }}>
        <PrettyAddress address={props.address} />
        {props.children}
      </Text>
    </Container>
  )
})

interface EditableAddressBoxProps {
  editHandler: () => void
  wallet: Wallet | undefined
}

export const EditableAddressBox = ({ editHandler, wallet }: EditableAddressBoxProps) => {
  if (!wallet) {
    return null
  }
  return (
    <AddressBox address={wallet.address}>
      <Button onClick={editHandler} icon={<Edit color="link" size="16px" />} />
    </AddressBox>
  )
}

interface EditableNameBoxProps {
  editHandler: () => void
  wallet: Wallet | undefined
}

export const EditableNameBox = ({ editHandler, wallet }: EditableNameBoxProps) => {
  if (!wallet) {
    return null
  }
  return (
    <Container address={wallet.address} copyToClipboard="button">
      <Text weight="bold" size="medium" wordBreak="break-word" style={{ flex: 1 }}>
        {wallet.name}
      </Text>
      <Button onClick={editHandler} icon={<Edit color="link" size="16px" />} />
    </Container>
  )
}
