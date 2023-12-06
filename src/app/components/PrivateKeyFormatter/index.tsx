import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Notification } from 'grommet/es6/components/Notification'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { useTranslation } from 'react-i18next'
import { NoTranslate } from 'app/components/NoTranslate'
import { hex2uint, uintToBase64 } from '../../lib/helpers'

export const PrivateKeyFormatter = ({ privateKey }: { privateKey: string }) => {
  const { t } = useTranslation()
  const [notificationVisible, setNotificationVisible] = useState(false)

  const copyAddress = () => {
    const wasCopied = copy(uintToBase64(hex2uint(privateKey)))
    if (wasCopied) {
      setNotificationVisible(true)
    }
  }

  return (
    <>
      <Box direction="row" gap="small">
        <Box round="5px" border={{ color: 'brand' }} pad="small" style={{ display: 'block' }}>
          <NoTranslate>{uintToBase64(hex2uint(privateKey))}</NoTranslate>
        </Box>
        <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} data-testid="copy-address" />
      </Box>
      {notificationVisible && (
        <Notification
          toast
          status={'normal'}
          title={t('toolbar.settings.exportPrivateKey.copied', 'Private key copied.')}
          onClose={() => setNotificationVisible(false)}
        />
      )}
    </>
  )
}
