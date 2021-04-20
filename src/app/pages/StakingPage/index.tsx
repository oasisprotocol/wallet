/**
 *
 * StakingPage
 *
 */
import { Box, Heading } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {}

export function StakingPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()

  return (
    <Box pad="large">
      <Heading level="1">Feature coming soon</Heading>
    </Box>
  )
}
