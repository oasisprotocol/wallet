import { Trans, useTranslation } from 'react-i18next'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { Info } from 'grommet-icons/es6/icons/Info'
import { Box } from 'grommet/es6/components/Box'
import { AlertBox } from 'app/components/AlertBox'
import { buildBannerZIndex } from '../../../styles/theme/elementSizes'
import { AnchorLink } from '../AnchorLink'

export const BuildBanner = () => {
  const { t } = useTranslation()

  if (!process.env.REACT_APP_BUILD_PREVIEW) {
    return (
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: buildBannerZIndex,
        }}
      >
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
      </Box>
    )
  }

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: buildBannerZIndex,
      }}
    >
      <AlertBox status="warning" center icon={<Alert size="20px" color="currentColor" />}>
        {t(
          'banner.buildPreview',
          'Please note this is an experimental build of Oasis Wallet and that data that is shown might be incorrect.',
        )}
      </AlertBox>
    </Box>
  )
}
