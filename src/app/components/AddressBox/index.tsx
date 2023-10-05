/**
 *
 * AddressBox
 *
 */
import { useContext } from 'react'
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { Notification } from 'grommet/es6/components/Notification'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { Edit } from 'grommet-icons/es6/icons/Edit'
import { memo, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
  separator?: boolean
}

interface ContainerProps extends AddressBoxProps {
  copyToClipboard: 'icon' | 'button'
}

const Container = ({ address, border, children, copyToClipboard, separator }: ContainerProps) => {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const isMobile = useContext(ResponsiveContext) === 'small'
  const hideNotification = () => setNotificationVisible(false)
  const copyAddress = () => {
    const wasCopied = copy(address)
    if (wasCopied) {
      setNotificationVisible(true)
    }
  }

  return (
    <Box
      align="center"
      border={border && { color: 'brand' }}
      direction={isMobile ? 'column' : 'row'}
      gap={isMobile ? 'medium' : undefined}
      pad={{ right: 'small' }}
      round="5px"
    >
      <Box
        align="center"
        border={
          separator
            ? {
                color: 'background-front-border',
                side: 'bottom',
              }
            : undefined
        }
        direction="row"
        flex
        pad={{ bottom: isMobile ? 'small' : 'xsmall' }}
        margin={{ right: isMobile ? undefined : 'large' }}
        width="690px" // keep the same width for address and name variants
      >
        {copyToClipboard === 'icon' && (
          <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address-icon" />
        )}
        <Box direction="row" flex={{ grow: 1 }}>
          {children}
        </Box>
      </Box>

      {copyToClipboard === 'button' && (
        <StyledButton
          label={trimLongString(address, 8, 6)}
          onClick={() => copyAddress()}
          icon={<Copy size="18px" color="currentColor" />}
          data-testid="copy-address-button"
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

const TextWrapper = ({ children }: { children: ReactNode }) => (
  <Text
    weight="bold"
    size="medium"
    wordBreak="break-word"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    }}
  >
    {children}
  </Text>
)

export const AddressBox = memo((props: AddressBoxProps) => {
  return (
    <Container
      address={props.address}
      border={props.border}
      copyToClipboard="icon"
      separator={props.separator}
    >
      <TextWrapper>
        <PrettyAddress address={props.address} />
        {props.children}
      </TextWrapper>
    </Container>
  )
})

interface EditableAddressBoxProps {
  openEditModal: () => void
  address: string
}

export const EditableAddressBox = ({ address, openEditModal }: EditableAddressBoxProps) => (
  <AddressBox address={address} separator>
    <Button
      onClick={openEditModal}
      icon={<Edit color="link" size="16px" />}
      data-testid="editable-address-edit-button"
    />
  </AddressBox>
)

interface EditableNameBoxProps extends EditableAddressBoxProps {
  name: string
}

export const EditableNameBox = ({ address, openEditModal, name }: EditableNameBoxProps) => (
  <Container address={address} copyToClipboard="button" separator>
    <TextWrapper>{name}</TextWrapper>
    <Button
      onClick={openEditModal}
      icon={<Edit color="link" size="16px" data-testid="editable-name-edit-button" />}
    />
  </Container>
)
