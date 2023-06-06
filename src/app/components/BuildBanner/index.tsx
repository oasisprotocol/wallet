import { Trans, useTranslation } from 'react-i18next'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { Info } from 'grommet-icons/es6/icons/Info'
import { Box } from 'grommet/es6/components/Box'
import { AlertBox } from 'app/components/AlertBox'
import { buildBannerZIndex } from '../../../styles/theme/elementSizes'
import { AnchorLink } from '../AnchorLink'
import styled from 'styled-components'
import { deploys } from '../../../config'

const StickyBanner = styled(Box)`
  position: sticky;
  top: 0;
  z-index: ${buildBannerZIndex};
`

export const BuildBanner = () => {
  const { t } = useTranslation()

  if (window.location.origin === deploys.production) {
    return (
      <StickyBanner>
        <AlertBox status="ok" center icon={<Info size="20px" color="currentColor" />}>
          <Trans
            i18nKey="banner.domainMoved"
            t={t}
            components={{
              NewLink: (
                <AnchorLink to="https://wallet.oasis.io/" label="https://wallet.oasis.io/" color="text" />
              ),
            }}
            defaults="Oasis Wallet has a new home at <NewLink />."
          />
        </AlertBox>
      </StickyBanner>
    )
  }

  if (window.location.origin === deploys.staging) {
    return (
      <StickyBanner>
        <AlertBox status="warning" center icon={<Alert size="20px" color="currentColor" />}>
          {t(
            'banner.buildStaging',
            'Please note this is the staging deployment of Oasis Wallet. ONLY USE IT FOR TESTING.',
          )}
        </AlertBox>
      </StickyBanner>
    )
  }

  return (
    <StickyBanner>
      <AlertBox status="warning" center icon={<Alert size="20px" color="currentColor" />}>
        {t(
          'banner.buildPreview',
          'Please note this is an experimental build of Oasis Wallet and your secrets are not safe. ONLY USE IT FOR TESTING.',
        )}
      </AlertBox>
    </StickyBanner>
  )
}
