/**
 *
 * AddressBox
 *
 */
import copy from 'copy-to-clipboard'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { Notification } from 'grommet/es6/components/Notification'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { Edit } from 'grommet-icons/es6/icons/Edit'
import { memo, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Wallet } from 'app/state/wallet/types'
import { PrettyAddress } from '../PrettyAddress'

interface AddressBoxProps {
  address: string
  border?: boolean
  children?: ReactNode
}

export const AddressBox = memo((props: AddressBoxProps) => {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)

  const hideNotification = () => setNotificationVisible(false)

  const address = props.address

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
      border={props.border && { color: 'brand' }}
    >
      <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address" />
      <Text weight="bold" size="medium" wordBreak="break-word" style={{ flex: 1 }}>
        <PrettyAddress address={address} />
      </Text>
      {props.children}
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
      <Button onClick={editHandler} icon={<Edit color="link" size="16 px" />} />
    </AddressBox>
  )
}
