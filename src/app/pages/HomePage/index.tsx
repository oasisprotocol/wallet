import { SetPassword } from 'app/components/Persist/SetPassword'
import { Box, Grid, Paragraph, ResponsiveContext } from 'grommet'
import { Add, Unlock } from 'grommet-icons'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from 'app/components/ButtonLink'
import { Header } from 'app/components/Header'

export function HomePage() {
  const size = useContext(ResponsiveContext)
  const { t } = useTranslation()
  return (
    <>
      <Grid gap="small" pad="small" columns={size === 'small' ? ['auto'] : ['2fr', '2fr']}>
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Header>{t('home.existing.header', 'Access existing wallet')}</Header>
          <Paragraph>
            {t(
              'home.existing.description',
              'Open your existing wallet stored on Ledger, import a private key or a mnemonic phrase.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <ButtonLink
              to="open-wallet"
              label={t('home.existing.button', 'Open wallet')}
              primary
              icon={<Unlock />}
            />
          </Box>
        </Box>
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Header>{t('home.create.header', 'Create new wallet')}</Header>
          <Paragraph>
            {t(
              'home.create.description',
              'Create a brand new wallet to send, receive, stake and swap ROSE tokens.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <ButtonLink
              to="create-wallet"
              label={t('home.create.button', 'Create wallet')}
              primary
              icon={<Add />}
            />
          </Box>
        </Box>

        <Box background="background-front" pad="large">
          <SetPassword></SetPassword>
        </Box>
      </Grid>
    </>
  )
}
