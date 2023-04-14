import { Box } from 'grommet/es6/components/Box'
import { Grid } from 'grommet/es6/components/Grid'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Add } from 'grommet-icons/es6/icons/Add'
import { Unlock } from 'grommet-icons/es6/icons/Unlock'
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
              icon={<Unlock a11yTitle={undefined} />}
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
              icon={<Add a11yTitle={undefined} />}
            />
          </Box>
        </Box>
      </Grid>
    </>
  )
}
