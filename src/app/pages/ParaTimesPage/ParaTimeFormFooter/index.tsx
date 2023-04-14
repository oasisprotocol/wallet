import React from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { useTranslation } from 'react-i18next'

type ParaTimeContentProps = {
  disabled?: boolean
  primaryLabel?: string
  primaryAction?: () => void
  secondaryLabel?: string
  secondaryAction?: () => void
  submitButton?: boolean
  withNotice?: boolean
}

export const ParaTimeFormFooter = ({
  disabled,
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
  submitButton,
  withNotice,
}: ParaTimeContentProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Box margin={{ bottom: 'large' }} align="center">
        <Box margin={{ bottom: 'medium' }}>
          <Button
            disabled={disabled}
            fill="horizontal"
            label={primaryLabel || t('paraTimes.footer.next', 'Next')}
            onClick={primaryAction}
            primary
            type={submitButton ? 'submit' : 'button'}
          />
        </Box>

        {secondaryAction && (
          <Button
            label={secondaryLabel || t('paraTimes.footer.back', 'Back')}
            onClick={secondaryAction}
            plain
            style={{ textAlign: 'center', fontSize: '14px', textDecoration: 'underline', color: 'brand' }}
          />
        )}
      </Box>

      {withNotice && (
        <Text size="small">
          {t('paraTimes.footer.notice', '* EVMc - compatible with Ethereum Virtual Machine')}
        </Text>
      )}
    </>
  )
}
