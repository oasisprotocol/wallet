/**
 *
 * OpenWalletPage
 *
 */
import { Anchor, Box } from 'grommet'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ButtonLink } from 'app/components/ButtonLink'
import { Header } from 'app/components/Header'

export function SelectOpenMethod() {
  const { t } = useTranslation()

  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      margin="small"
      pad="medium"
    >
      <Header>{t('openWallet.header', 'How do you want to open your wallet?')}</Header>

      <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
        <span>
          <ButtonLink to="mnemonic" label={t('openWallet.method.mnemonic', 'Mnemonic')} primary />
        </span>
        <span>
          <ButtonLink to="private-key" label={t('openWallet.method.privateKey', 'Private key')} primary />
        </span>
        <span>
          <ButtonLink to="ledger" label={t('openWallet.method.ledger', 'Ledger')} primary />
        </span>
      </Box>

      <Box
        direction="row-responsive"
        justify="start"
        margin={{ top: 'medium' }}
        gap="medium"
        style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
      >
        <Trans
          i18nKey="openWallet.bitpie.warning"
          t={t}
          defaults="❗ BitPie wallet users: You cannot import the mnemonic phrase directly from your BitPie wallet. <DocsLink>Check documentation for details.</DocsLink>"
          components={{
            DocsLink: <Anchor href="https://docs.oasis.io/general/manage-tokens/faq" />,
          }}
        />
      </Box>
    </Box>
  )
}

export function OpenWalletPage() {
  return <SelectOpenMethod />
}
