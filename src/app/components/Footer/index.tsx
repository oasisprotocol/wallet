import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { selectIsOpen } from 'app/state/wallet/selectors'
import { intlDateTimeFormat } from '../DateFormatter'
import { backend } from 'vendors/backend'
import { BackendAPIs } from 'config'
import { MobileFooterNavigation } from '../MobileFooterNavigation'
import { mobileFooterNavigationHeight } from '../../../styles/theme/elementSizes'

const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'
const githubReleaseLink = (tag: string) => `${githubLink}releases/tag/${tag}`

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
          components={{ GithubLink: <Anchor href={githubLink} target="_blank" rel="noopener noreferrer" /> }}
          defaults="Oasis Wallet is fully <GithubLink>open source</GithubLink> - Feedback and issues are appreciated!"
        />
      </Text>
      <Text size={responsiveSize} textAlign="center" margin={{ bottom: responsiveSize }}>
        <Trans
          i18nKey="footer.terms"
          t={t}
          components={{
            TermsLink: (
              <Anchor href="https://wallet.oasisprotocol.org/t-c" target="_blank" rel="noopener noreferrer" />
            ),
          }}
          defaults="<TermsLink>Terms and Conditions</TermsLink>"
        />
      </Text>
      {process.env.REACT_APP_BUILD_DATETIME && process.env.REACT_APP_BUILD_SHA && (
        <Text size="small" textAlign="center">
          <Trans
            i18nKey="footer.version"
            t={t}
            components={{
              ReleaseLink: process.env.REACT_APP_BUILD_VERSION ? (
                <Anchor
                  href={githubReleaseLink(process.env.REACT_APP_BUILD_VERSION)}
                  label={process.env.REACT_APP_BUILD_VERSION.replace('v', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ) : (
                <></>
              ),
              CommitLink: (
                <Anchor
                  href={`${githubLink}commit/${process.env.REACT_APP_BUILD_SHA}`}
                  label={process.env.REACT_APP_BUILD_SHA.substring(0, 7)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
            defaults="Version: <ReleaseLink/> (commit: <CommitLink/>) built at {{buildTime}}"
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
