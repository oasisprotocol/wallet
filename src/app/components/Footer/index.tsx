import { Anchor, Box, ResponsiveContext, Text } from 'grommet'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { selectIsOpen } from 'app/state/wallet/selectors'
import { intlDateTimeFormat } from '../DateFormatter'
import { backend, BackendAPIs } from 'vendors/backend'
import { MobileFooterNavigation, mobileFooterNavigationHeight } from '../MobileFooterNavigation'

const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'

export const Footer = memo(() => {
  const isAccountOpen = useSelector(selectIsOpen)
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const { t } = useTranslation()

  const backendToLabel = {
    [BackendAPIs.OasisMonitor]: t(
      'footer.poweredBy.oasismonitor',
      'Powered by Oasis Monitor API & Oasis gRPC',
    ),
    [BackendAPIs.OasisScan]: t('footer.poweredBy.oasisscan', 'Powered by Oasis Scan API & Oasis gRPC'),
  }
  const poweredByLabel = backendToLabel[backend()]
  const responsiveSize = isMobile ? 'small' : 'medium'

  return (
    <Box
      as="footer"
      direction="column"
      justify="center"
      align="center"
      round="5px"
      pad={{
        horizontal: 'medium',
        top: isMobile ? '1rem' : 'medium',
        bottom: isMobile && isAccountOpen ? mobileFooterNavigationHeight : 'none',
      }}
      margin={{ bottom: 'large' }}
    >
      <Text size={responsiveSize} textAlign="center" margin={{ bottom: isMobile ? 'small' : 'none' }}>
        <Trans
          i18nKey="footer.github"
          t={t}
          components={[<Anchor href={githubLink} />]}
          defaults="Oasis Wallet is fully <0>open source</0> - Feedback and issues are appreciated!"
        />
      </Text>
      <Text size={responsiveSize} textAlign="center" margin={{ bottom: responsiveSize }}>
        <Trans
          i18nKey="footer.terms"
          t={t}
          components={[<Anchor href="https://wallet.oasisprotocol.org/t-c" />]}
          defaults="<0>Terms and Conditions</0>"
        />
      </Text>
      {process.env.REACT_APP_BUILD_DATETIME && process.env.REACT_APP_BUILD_SHA && (
        <Text size="small" textAlign="center">
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
              buildTime: intlDateTimeFormat(Number(process.env.REACT_APP_BUILD_DATETIME)),
            }}
          />
          {poweredByLabel && <Box align="center">{poweredByLabel}</Box>}
        </Text>
      )}

      <MobileFooterNavigation isAccountOpen={isAccountOpen} isMobile={isMobile} />
    </Box>
  )
})
