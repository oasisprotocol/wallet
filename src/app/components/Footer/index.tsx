import { Anchor, Box, Text } from 'grommet'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

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
    >
      <Text>
        <Trans
          i18nKey="footer.github"
          t={t}
          components={[<Anchor href="https://github.com/oasisprotocol/oasis-wallet-web" />]}
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
    </Box>
  )
})
