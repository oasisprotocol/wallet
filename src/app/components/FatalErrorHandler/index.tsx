/**
 *
 * FatalError
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import { selectFatalError } from 'app/state/fatalerror/selectors'
import copy from 'copy-to-clipboard'
import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Heading } from 'grommet/es6/components/Heading'
import { Text } from 'grommet/es6/components/Text'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { StatusWarning } from 'grommet-icons/es6/icons/StatusWarning'
import * as React from 'react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ResponsiveLayer } from '../ResponsiveLayer'

interface Props {
  children?: React.ReactNode
}

export function FatalErrorHandler({ children }: Props) {
  const { t } = useTranslation()
  const fatalError = useSelector(selectFatalError)
  const [copied, setCopied] = useState(false)

  if (!fatalError) {
    return <>{children}</>
  }

  const combinedStacktrace = `${fatalError.message}\n\n${fatalError.sagaStack}\n\n${fatalError.stack}`

  const copyError = () => {
    copy(combinedStacktrace)
    setCopied(true)
  }

  return (
    <ResponsiveLayer modal background="background-front" full>
      <Box pad="large">
        <Box direction="row" align="center" gap="small" pad={{ vertical: 'small' }}>
          <StatusWarning size="large" />
          <Heading margin="none">{t('fatalError.heading', 'A fatal error occurred')}</Heading>
        </Box>
        <Box pad={{ vertical: 'small' }}>
          <Text>
            <Trans
              i18nKey="fatalError.instruction"
              defaults="A fatal error has occurred and Oasis Wallet must stop. Try refreshing the page and reopening your wallet to see if the issue persists. If the issue persists, please contact our support team via <Email/> email and attach the report below."
              t={t}
              components={{
                Email: (
                  <Anchor href="mailto:wallet@oasisprotocol.org" label="wallet@oasisprotocol.org"></Anchor>
                ),
              }}
            />
          </Text>
        </Box>
        <AlertBox color="status-error">
          <Text weight="normal">
            <pre data-testid="fatalerror-stacktrace">{combinedStacktrace}</pre>
          </Text>
        </AlertBox>
        <Box align="end" pad={{ vertical: 'medium' }}>
          <Button
            onClick={() => copyError()}
            icon={<Copy size="18px" />}
            label={
              !copied
                ? t('fatalError.copy', 'Copy error to clipboard')
                : t('fatalError.copied', 'Error copied to clipboard')
            }
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
