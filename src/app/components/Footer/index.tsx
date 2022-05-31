import { Anchor, Box, Text } from 'grommet'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { dateFormat } from '../DateFormatter'
import { backend, BackendAPIs } from 'vendors/backend'

const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'

export const Footer = memo(() => {
  const { t } = useTranslation()

  const backendToLabel = {
    [BackendAPIs.OasisMonitor]: t(
      'footer.poweredBy.oasismonitor',
      'Powered by Oasis Monitor API & Oasis gRPC',
    ),
    [BackendAPIs.OasisScan]: t('footer.poweredBy.oasisscan', 'Powered by Oasis Scan API & Oasis gRPC'),
  }
  const poweredByLabel = backendToLabel[backend()]

  return (
    <Box
      direction="column"
      justify="center"
      align="center"
      round="5px"
      // border={{ color: 'brand' }}
      pad={{ right: 'small', top: 'medium' }}
      margin={{ bottom: 'large' }}
    >
      <Text>
        <Trans
          i18nKey="footer.github"
          t={t}
          components={[<Anchor href={githubLink} />]}
          defaults="Oasis Wallet is fully <0>open source</0> - Feedback and issues are appreciated!"
        />
      </Text>
      <Text>
        <Trans
          i18nKey="footer.terms"
          t={t}
          components={[<Anchor href="https://wallet.oasisprotocol.org/t-c" />]}
          defaults="<0>Terms and Conditions</0>"
        />
      </Text>
      {process.env.REACT_APP_BUILD_DATETIME && process.env.REACT_APP_BUILD_SHA && (
        <Text size="small" margin={{ top: 'medium' }}>
          <Trans
            i18nKey="footer.version"
            t={t}
            components={[
              <Anchor
                href={`${githubLink}commit/${process.env.REACT_APP_BUILD_SHA}`}
                label={process.env.REACT_APP_BUILD_SHA.substring(0, 7)}
              />,
            ]}
            defaults="Version: <0></0> built at {{buildTime}}"
            values={{
              buildTime: dateFormat.format(Number(process.env.REACT_APP_BUILD_DATETIME)),
            }}
          />
          {poweredByLabel && <Box align="center">{poweredByLabel}</Box>}
        </Text>
      )}
    </Box>
  )
})
