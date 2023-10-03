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
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PrettyAddress } from '../PrettyAddress'

interface Props {
  address: string
  border?: boolean
  editHandler?: () => void
  name?: string
}

const textWidth = '680px'

export const AddressBox = memo((props: Props) => {
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
      <Box
        direction="row"
        align="center"
        border={{
          color: 'background-front-border',
          side: 'bottom',
        }}
        margin={{ right: 'large' }}
        flex
        width={textWidth}
      >
        {!props.name && (
          <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address" />
        )}
        <Text weight="bold" size="medium" wordBreak="break-word" style={{ flex: 1, width: textWidth }}>
          {props.name ? <span>{props.name}</span> : <PrettyAddress address={address} />}
        </Text>
        {props.editHandler && <Button onClick={props.editHandler} icon={<Edit color="link" size="16px" />} />}
      </Box>
      {props.name && (
        <Button
          label="oasis1... c6hae7"
          onClick={() => copyAddress()}
          icon={<Copy size="18px" />}
          data-testid="copy-address"
          reverse
          style={{ backgroundColor: '#E8F5FF', borderWidth: '1px' }}
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
})
