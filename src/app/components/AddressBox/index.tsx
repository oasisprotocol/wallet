/**
 *
 * AddressBox
 *
 */
import copy from 'copy-to-clipboard'
import { Box, Button, Text, Notification } from 'grommet'
import { Copy } from 'grommet-icons'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PrettyAddress } from '../PrettyAddress'

interface Props {
  address: string
}

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
    <Box direction="row" align="center" round="5px" pad={{ right: 'small' }} width="fit-content">
      <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address" />
      <Text weight="bold" size="medium" wordBreak="break-word">
        <PrettyAddress address={address} />
      </Text>
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
