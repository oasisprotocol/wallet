import { Box, Button, Grid, Heading, Paragraph, ResponsiveContext } from 'grommet'
import { Add, Unlock } from 'grommet-icons/icons'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

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
          <Heading size="1">{t('home.existing.header', 'Access existing wallet')}</Heading>
          <Paragraph>
            {t(
              'home.existing.description',
              'Open your existing wallet stored on Ledger, import a private key or a mnemonic phrase.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="/open-wallet">
              <Button
                type="submit"
                label={t('home.existing.button', 'Open wallet')}
                style={{ borderRadius: '4px' }}
                primary
                icon={<Unlock />}
              />
            </NavLink>
          </Box>
        </Box>
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Heading size="1">{t('home.create.header', 'Create new wallet')}</Heading>
          <Paragraph>
            {t(
              'home.create.description',
              'Create a brand new wallet to send, receive, stake and swap ROSE tokens.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="/create-wallet">
              <Button
                type="submit"
                label={t('home.create.button', 'Create wallet')}
                style={{ borderRadius: '4px' }}
                primary
                icon={<Add />}
              />
            </NavLink>
          </Box>
        </Box>
      </Grid>
    </>
  )
}
