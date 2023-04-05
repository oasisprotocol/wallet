import { Box, Text, Notification } from 'grommet'
import * as React from 'react'
import type { Icon } from 'grommet-icons'
import copy from 'copy-to-clipboard'
import { trimLongString } from '../ShortAddress'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface InfoBoxProps {
  copyToClipboard?: boolean
  icon: Icon
  label: string
  value: string
  trimValue?: boolean
}

export function InfoBox({ copyToClipboard, icon: IconComponent, label, trimValue, value }: InfoBoxProps) {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)

  const hideNotification = () => setNotificationVisible(false)

  const copyValue = () => {
    if (!copyToClipboard) return
    const wasCopied = copy(value)
    if (wasCopied) {
      setNotificationVisible(true)
    }
  }

  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator={{ color: 'background-contrast' }}
      pad={{ horizontal: 'small', vertical: 'small' }}
      onClick={copyValue}
    >
      <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
        <IconComponent color="brand" size="20px" />
      </Box>

      <Box justify="center">
        <Text weight="bold">{label}</Text>
        {trimValue ? <Text>{trimLongString(value)}</Text> : <Text>{value}</Text>}
      </Box>
      {notificationVisible && (
        <Notification
          toast
          status={'normal'}
          title={t('infoBox.valueCopied', '{{ label }} copied.', { label })}
          onClose={hideNotification}
        />
      )}
    </Box>
  )
}
