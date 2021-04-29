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
          <Heading size="1">{t('home.existing.header')}</Heading>
          <Paragraph>{t('home.existing.description')}</Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="/open-wallet">
              <Button
                type="submit"
                label={t('home.existing.button')}
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
          <Heading size="1">{t('home.create.header')}</Heading>
          <Paragraph>{t('home.create.description')}</Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="/create-wallet">
              <Button
                type="submit"
                label={t('home.create.button')}
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
