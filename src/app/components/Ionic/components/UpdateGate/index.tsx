import React, { FC, PropsWithChildren, useContext } from 'react'
import { IonicContext } from '../../providers/IonicContext'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { navigateToAppStore } from '../../utils/capacitor-app-update'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import walletWhiteLogotype from '../../../../../../public/Rose Wallet White.svg'
import { Text } from 'grommet/es6/components/Text'
import { ShareRounded } from 'grommet-icons/es6/icons/ShareRounded'
import { Refresh } from 'grommet-icons/es6/icons/Refresh'
import styled, { keyframes } from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'
import { MuiWalletIcon } from '../../../../../styles/theme/icons/mui-icons/MuiWalletIcon'
import { Spinner } from 'grommet/es6/components/Spinner'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { useTranslation } from 'react-i18next'

const SpinKeyFrames = keyframes`
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(359deg)
  }
`

// TODO: Merge with Spinner.icon when grommet dependency is updated
const RefreshSpin = styled(Refresh)`
  transform: rotate(0deg);
  animation: ${SpinKeyFrames} 1s 0s infinite linear;
`

const CTAButton = styled(Button)`
  background-color: ${({ theme }) => normalizeColor('brand-light-blue', theme)};
  border-width: 0;
  border-radius: 8px;
`

export const UpdateGate: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const {
    state: { requiresUpdate },
  } = useContext(IonicContext)

  if (requiresUpdate === false) return children

  const handleNavigateToAppStore = () => {
    navigateToAppStore()
  }

  return (
    <Box direction="column" background="brand-blue" fill pad="large" style={{ minHeight: '100dvh' }}>
      <Box alignSelf={isMobile ? 'start' : 'center'}>
        <img alt="ROSE Wallet" src={walletWhiteLogotype} style={{ height: '35px' }} />
      </Box>
      {requiresUpdate === undefined && (
        <Box align="center" justify="center" flex="grow">
          <Spinner />
        </Box>
      )}
      {requiresUpdate === true && (
        <Box flex="grow">
          <Box align="center" justify="center" flex="grow">
            <Box margin={{ bottom: '70px', top: 'none' }} align="center">
              <RefreshSpin color="white" size="44" />
              <MuiWalletIcon color="white" size="84px" />
            </Box>
            <Paragraph
              size="medium"
              color="brand-light-blue"
              alignSelf={isMobile ? 'start' : 'center'}
              textAlign={isMobile ? 'start' : 'center'}
              margin={{ bottom: 'small', top: 'none' }}
            >
              <Text weight="bolder">{t('mobileUpdate.updatePending', 'Update pending...')}</Text>
            </Paragraph>
            <Paragraph
              size="small"
              color="brand-light-blue"
              alignSelf={isMobile ? 'start' : 'center'}
              textAlign={isMobile ? 'start' : 'center'}
              margin="none"
            >
              {t(
                'mobileUpdate.updateDescription',
                'A new update is available for your ROSE Wallet. We recommend updating to the latest version for bug fixes, enhanced security and new features.',
              )}
            </Paragraph>
          </Box>
          <Box align="center" justify="end" flex="shrink">
            <CTAButton
              type="button"
              onClick={handleNavigateToAppStore}
              margin="medium"
              pad={{ vertical: 'small', horizontal: 'large' }}
              label={
                <Text color="brand-blue" weight="bolder" size="medium">
                  {t('mobileUpdate.updateNow', 'Update now')}
                </Text>
              }
              icon={<ShareRounded color="brand-blue" size="18px" />}
              reverse
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
