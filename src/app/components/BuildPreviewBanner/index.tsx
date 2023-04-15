import { useTranslation } from 'react-i18next'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { AlertBox } from 'app/components/AlertBox'
import { buildPreviewBannerZIndex } from '../../../styles/theme/elementSizes'

export const BuildPreviewBanner = () => {
  const { t } = useTranslation()

  if (!process.env.REACT_APP_BUILD_PREVIEW) {
    return null
  }

  return (
    <Box
      background={{ color: 'white' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: buildPreviewBannerZIndex,
      }}
    >
      <AlertBox color="status-warning">
        <Box direction="row" gap="small" align="center" justify="center">
          <Alert color="status-warning" size="20px" />
          <Text size="12px">
            {t(
              'buildPreview',
              'Please note this is an experimental build of Oasis Wallet and that data that is shown might be incorrect.',
            )}
          </Text>
        </Box>
      </AlertBox>
    </Box>
  )
}
