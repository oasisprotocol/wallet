import { Anchor, Box, Text } from 'grommet'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { dateFormat } from '../DateFormatter'
const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'

export const Footer = memo(() => {
  const { t } = useTranslation()

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
      {process.env.REACT_APP_BUILD_TIME && process.env.REACT_APP_BUILD_VERSION && (
        <Text size="small" margin={{ top: 'medium' }}>
          <Trans
            i18nKey="footer.version"
            t={t}
            components={[
              <Anchor
                href={`${githubLink}commit/${process.env.REACT_APP_BUILD_VERSION}`}
                label={process.env.REACT_APP_BUILD_VERSION.substring(0, 7)}
              />,
            ]}
            defaults="Version: <0>{{commit}}</0> built at {{buildTime}}"
            values={{
              buildTime: dateFormat.format(Number(process.env.REACT_APP_BUILD_TIME)),
              commit: process.env.REACT_APP_WALLET_VERSION,
            }}
          />
        </Text>
      )}
    </Box>
  )
})
