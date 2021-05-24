/**
 *
 * FatalError
 *
 */
import { useFatalErrorSlice } from 'app/state/fatalerror'
import { selectFatalError } from 'app/state/fatalerror/selectors'
import copy from 'copy-to-clipboard'
import { Anchor, Box, Button, Heading, Text } from 'grommet'
import { Copy, StatusWarning } from 'grommet-icons'
import * as React from 'react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ResponsiveLayer } from '../ResponsiveLayer'

interface Props {}

export function FatalErrorHandler(props: Props) {
  const { t } = useTranslation()
  useFatalErrorSlice()
  const fatalError = useSelector(selectFatalError)
  const [copied, setCopied] = useState(false)

  if (!fatalError) {
    return null
  }

  const copyError = () => {
    copy(`${fatalError.message}\n${fatalError.sagaStack}\n${fatalError.stack}`)
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
              components={[<Anchor href="https://github.com/esya/oasis-wallet/issues" />]}
              defaults="A fatal unexpected error has occurred and Oasis-wallet must stop. Please copy report this issue below on our <0>github account</0>. You can also try refreshing page to see if the issue persists. Once you leave this page, all of your wallets will be closed."
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
            opacity: 0.3,
          }}
          pad={{ horizontal: 'small', vertical: 'xsmall' }}
        >
          <Box>
            <Text weight="bold" data-testid="fatalerror-message">
              {fatalError.message}
            </Text>
          </Box>
          <pre>{fatalError.sagaStack}</pre>
          <pre>{fatalError.stack}</pre>
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
