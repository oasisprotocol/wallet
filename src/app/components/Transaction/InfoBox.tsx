import { ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { Notification } from 'grommet/es6/components/Notification'
// eslint-disable-next-line no-restricted-imports
import type { Icon } from 'grommet-icons/es6/icons'
import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface InfoBoxProps {
  copyToClipboardValue?: string
  icon: Icon
  label: string
  children: ReactNode
}

export function InfoBox({ children, copyToClipboardValue, icon: IconComponent, label }: InfoBoxProps) {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const hideNotification = () => setNotificationVisible(false)
  const copyValue = () => {
    if (!copyToClipboardValue) {
      return
    }
    const wasCopied = copy(copyToClipboardValue)
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
      onClick={copyToClipboardValue ? copyValue : undefined}
    >
      <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
        <IconComponent color="brand" size="20px" />
      </Box>
      <Box justify="center">
        <Text weight="bold" color="grayMedium" style={{ opacity: 0.5 }}>
          {label}
        </Text>
        {children}
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
