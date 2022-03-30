/**
 *
 * FatalError
 *
 */
import { selectFatalError } from 'app/state/fatalerror/selectors'
import copy from 'copy-to-clipboard'
import { Anchor, Box, Button, Heading, Text } from 'grommet'
import { Copy, StatusWarning } from 'grommet-icons/icons'
import * as React from 'react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ResponsiveLayer } from '../ResponsiveLayer'

interface Props {}

export function FatalErrorHandler(props: Props) {
  const { t } = useTranslation()
  const fatalError = useSelector(selectFatalError)
  const [copied, setCopied] = useState(false)

  if (!fatalError) {
    return null
  }

  const combinedStacktrace = `${fatalError.message}\n\n${fatalError.sagaStack}\n\n${fatalError.stack}`

  const copyError = () => {
    copy(combinedStacktrace)
    setCopied(true)
  }

  return (
    <ResponsiveLayer background="background-front" full>
      <Box pad="large">
        <Box direction="row" align="center" gap="small" pad={{ vertical: 'small' }}>
          <StatusWarning size="large" />
          <Heading margin="none">{t('fatalError.heading', 'A fatal error occurred')}</Heading>
        </Box>
        <Box pad={{ vertical: 'small' }}>
          <Text>
            <Trans
              i18nKey="fatalError.instruction"
              t={t}
              components={[<Anchor href="mailto:wallet@oasisprotocol.org" />]}
            />
          </Text>
        </Box>
        <Box
          border={{
            color: 'status-error',
            side: 'left',
            size: '3px',
          }}
          background={{
            color: 'status-error',
            opacity: 'weak',
          }}
          pad={{ horizontal: 'small', vertical: 'xsmall' }}
        >
          <pre data-testid="fatalerror-stacktrace">{combinedStacktrace}</pre>
        </Box>
        <Box align="end" pad={{ vertical: 'medium' }}>
          <Button
            onClick={() => copyError()}
            icon={<Copy size="18px" />}
            label={
              !copied
                ? t('fatalError.copy', 'Copy error to clipboard')
                : t('fatalError.copied', 'Error copied to clipboard')
            }
            style={{ borderRadius: '4px' }}
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
