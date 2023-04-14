import { selectLoading } from 'app/state/persist/selectors'
import { Box } from 'grommet/es6/components/Box'
import { Layer } from 'grommet/es6/components/Layer'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface Props {
  children: React.ReactNode
}

/**
 * Prevent new actions while order-sensitive actions are in persist queue.
 */
export function PersistLoadingGate(props: Props) {
  const { t } = useTranslation()
  const loading = useSelector(selectLoading)

  return (
    <>
      {loading && (
        <Layer modal background="background-front" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center">
            <Spinner size="medium" />
            <Text size="large">{t('persist.loading', 'Loading')}</Text>
          </Box>
        </Layer>
      )}
      {props.children}
    </>
  )
}
