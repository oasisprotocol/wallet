import { useTranslation } from 'react-i18next'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { Box } from 'grommet/es6/components/Box'
import { AlertBox } from 'app/components/AlertBox'
import { buildBannerZIndex } from '../../../styles/theme/elementSizes'
import styled from 'styled-components'
import { deploys } from '../../../config'

const StickyBanner = styled(Box)`
  position: sticky;
  top: 0;
  z-index: ${buildBannerZIndex};
`

export const BuildBanner = () => {
  const { t } = useTranslation()

  if (window.location.origin === deploys.extension) {
    return null
  }

  if (deploys.production.includes(window.location.origin)) {
    return null
  }

  if (deploys.staging.includes(window.location.origin)) {
    return (
      <StickyBanner data-testid="build-banner">
        <AlertBox status="warning" justify="center" icon={<Alert size="20px" />}>
          {t(
            'banner.buildStaging',
            'Please note this is the staging deployment of ROSE Wallet. ONLY USE IT FOR TESTING.',
          )}
        </AlertBox>
      </StickyBanner>
    )
  }

  return (
    <StickyBanner data-testid="build-banner">
      <AlertBox status="warning" justify="center" icon={<Alert size="20px" />}>
        {t(
          'banner.buildPreview',
          'Please note this is an experimental build of ROSE Wallet and your secrets are not safe. ONLY USE IT FOR TESTING.',
        )}
      </AlertBox>
    </StickyBanner>
  )
}
