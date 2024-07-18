/**
 *
 * AddressBox
 *
 */
import { useContext, memo, useState, ReactNode } from 'react'
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
import { useTranslation } from 'react-i18next'
import { trimLongString } from '../ShortAddress/trimLongString'
import { PrettyAddress } from '../PrettyAddress'

const StyledBox = styled(Box)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${({ theme }) => normalizeColor('background-custom-2', theme)};
  border-radius: ${({ theme }) => theme.button?.border?.radius};
  color: ${({ theme }) => normalizeColor('text-custom', theme)};
  padding: ${({ theme }) => `${theme.global?.edgeSize?.xsmall} ${theme.global?.edgeSize?.medium}`};
  border: ${({ theme }) => `solid ${theme.global?.borderSize?.xsmall} ${normalizeColor('brand', theme)}`};
  font-weight: 700;
`

interface AddressBoxProps {
  address: string
  border?: boolean
  children?: ReactNode
  separator?: boolean
  trimMobile?: boolean
}

interface ContainerProps extends AddressBoxProps {
  copyToClipboard?: 'icon' | 'button'
}

const Container = ({ address, border, children, copyToClipboard, separator }: ContainerProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <>
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
          {copyToClipboard === 'icon' && <CopyAddressButton address={address} />}
          <Box flex>{children}</Box>
        </Box>

        {copyToClipboard === 'button' && <MobileAddress address={address} />}
      </Box>
    </>
  )
}

const TextWrapper = ({ children }: { children: ReactNode }) => (
  <Text
    weight="bold"
    size="inherit"
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
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Container
      address={props.address}
      border={props.border}
      copyToClipboard={props.trimMobile && isMobile ? undefined : 'icon'}
      separator={props.separator}
    >
      <TextWrapper>
        {props.trimMobile && isMobile && <MobileAddress address={props.address} />}
        {(!props.trimMobile || !isMobile) && <PrettyAddress address={props.address} />}
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
  <AddressBox address={address} separator trimMobile>
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
    <Box direction="row" pad={{ left: 'small' }}>
      <TextWrapper>{name}</TextWrapper>
      <Button
        onClick={openEditModal}
        icon={<Edit color="link" size="16px" data-testid="editable-name-edit-button" />}
      />
    </Box>
  </Container>
)

interface MobileAddressProps {
  address: string
}

const MobileAddress = ({ address }: MobileAddressProps) => {
  return (
    <CopyAddressButton address={address}>
      <StyledBox>
        {trimLongString(address, 8, 6)}
        <Copy size="18px" />
      </StyledBox>
    </CopyAddressButton>
  )
}

interface CopyAddressButtonProps {
  address: string
  children?: ReactNode
}

const CopyAddressButton = ({ address, children }: CopyAddressButtonProps) => {
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
    <>
      <Button
        onClick={() => copyAddress()}
        icon={children ? undefined : <Copy size="18px" />}
        data-testid="copy-address-button"
      >
        {children}
      </Button>

      {notificationVisible && (
        <Notification
          toast
          status={'normal'}
          title={t('account.addressCopied', 'Address copied.')}
          onClose={hideNotification}
        />
      )}
    </>
  )
}
