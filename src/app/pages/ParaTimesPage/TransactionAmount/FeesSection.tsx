import React, { useState } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Collapsible } from 'grommet/es6/components/Collapsible'
import { FormField } from 'grommet/es6/components/FormField'
import { TextInput } from 'grommet/es6/components/TextInput'
import { useTranslation } from 'react-i18next'

type FeesSectionProps = {
  feeAmount: string
  feeGas: string
  ticker: string
}

export const FeesSection = ({ feeAmount, feeGas, ticker }: FeesSectionProps) => {
  const { t } = useTranslation()
  const hasValue = !!feeAmount || !!feeGas
  const [open, setOpen] = useState(hasValue)

  return (
    <Box pad={{ vertical: 'medium' }}>
      <Box align="start">
        <Button
          disabled={hasValue}
          label={t('paraTimes.amount.advanced', 'Advanced')}
          margin={{ bottom: 'medium' }}
          onClick={() => setOpen(!open)}
          secondary
          size="small"
        />
      </Box>
      <Collapsible open={open}>
        <FormField
          name="feeAmount"
          validate={{
            regexp: /^(\s*|[0-9][0-9]*)$/,
            message: t('paraTimes.validation.invalidFee', 'Value must be integer greater than or equal to 0'),
          }}
        >
          <TextInput
            min="0"
            name="feeAmount"
            placeholder={t('paraTimes.amount.feeAmountPlaceholder', 'Fee Amount (nano {{ticker}})', {
              ticker,
            })}
            step="1"
            type="number"
            value={feeAmount}
          />
        </FormField>
        <FormField
          name="feeGas"
          validate={{
            regexp: /^(\s*|[0-9][0-9]*)$/,
            message: t('paraTimes.validation.invalidFee', 'Value must be integer greater than or equal to 0'),
          }}
        >
          <TextInput
            min="0"
            name="feeGas"
            placeholder={t('paraTimes.amount.feeGasPlaceholder', 'Fee Gas')}
            step="1"
            type="number"
            value={feeGas}
          />
        </FormField>
      </Collapsible>
    </Box>
  )
}
