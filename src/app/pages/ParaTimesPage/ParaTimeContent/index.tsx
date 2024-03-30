import React, { useContext, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Heading } from 'grommet/es6/components/Heading'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { useTranslation } from 'react-i18next'
import { useParaTimes } from '../useParaTimes'

type ParaTimeContentProps = {
  children?: ReactNode
  description: ReactNode
  header?: string
  isLoading?: boolean
}

export const ParaTimeContent = ({ children, description, header, isLoading }: ParaTimeContentProps) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const { isDepositing } = useParaTimes()

  return (
    <Box align="center">
      <Heading level={3} margin={{ bottom: 'large' }}>
        {header ||
          (isDepositing
            ? t('paraTimes.common.depositHeader', 'Deposit to ParaTime')
            : t('paraTimes.common.withdrawHeader', 'Withdraw from ParaTime'))}
      </Heading>
      <Box margin={{ bottom: 'large' }} style={{ maxWidth: 'min(100%, 550px)' }}>
        <Text
          data-testid="paraTime-content-description"
          textAlign="center"
          size={isMobile ? '16px' : 'medium'}
        >
          {description}
        </Text>
      </Box>
      <Box align="center" fill="horizontal" gap="medium" margin={{ bottom: 'xlarge' }} responsive={false}>
        {/* eslint-disable-next-line no-restricted-syntax -- children are not a plain text node */}
        {isLoading ? <Spinner data-testid="paraTime-content-loading" size="medium" /> : children}
      </Box>
    </Box>
  )
}
