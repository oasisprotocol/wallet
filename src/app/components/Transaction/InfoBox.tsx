import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { Notification } from 'grommet/es6/components/Notification'
import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import type { Icon } from 'grommet-icons/es6/icons'
import copy from 'copy-to-clipboard'
import { trimLongString } from '../ShortAddress/trimLongString'
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
      onClick={copyToClipboard ? copyValue : undefined}
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
          title={t('infoBox.valueCopied', '{{label}} copied.', { label })}
          onClose={hideNotification}
        />
      )}
    </Box>
  )
}
