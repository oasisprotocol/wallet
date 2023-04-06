import React from 'react'
import { Box, Form, FormField, Text, Select } from 'grommet'
import { useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

type ParaTimeOptionProps = {
  label: string
  isEvm?: boolean
}
const ParaTimeOption = ({ label, isEvm }: ParaTimeOptionProps) => {
  const { t } = useTranslation()

  return (
    <Box direction="row" justify="between" width="240px">
      <span>{label}</span>
      {isEvm && <Text color="lightText">{t('paraTimes.selection.evmc', 'EVMc')}</Text>}
    </Box>
  )
}

export const ParaTimeSelection = () => {
  const { t } = useTranslation()
  const {
    availableParaTimesForSelectedNetwork,
    clearTransactionForm,
    isDepositing,
    setTransactionForm,
    ticker,
    transactionForm,
  } = useParaTimes()
  const { navigateToRecipient } = useParaTimesNavigation()
  const options = availableParaTimesForSelectedNetwork.map(item => ({
    label: <ParaTimeOption label={t(`paraTimes.common.${item.value}`)} isEvm={item.isEvm} />,
    value: item.value,
  }))

  return (
    <ParaTimeContent
      description={
        isDepositing
          ? t(
              'paraTimes.selection.depositDescription',
              'Please select which ParaTime you wish to deposit your {{ticker}} to and then click "Next".',
              {
                ticker,
              },
            )
          : t(
              'paraTimes.selection.withdrawDescription',
              'Please select which ParaTime you wish to withdraw your {{ticker}} from and then click "Next".',
              {
                ticker,
              },
            )
      }
    >
      <Form
        messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={navigateToRecipient}
        value={transactionForm}
      >
        <Box style={{ maxWidth: '300px' }}>
          <Box margin={{ bottom: 'medium' }}>
            <FormField name="paraTime" required>
              <Select
                name="paraTime"
                placeholder={t('paraTimes.selection.select', 'Select a ParaTime')}
                labelKey="label"
                valueKey={{ key: 'value', reduce: true }}
                value={transactionForm.paraTime}
                options={options}
              />
            </FormField>
          </Box>
        </Box>

        <ParaTimeFormFooter
          secondaryAction={clearTransactionForm}
          secondaryLabel={t('paraTimes.selection.cancel', 'Cancel transfer')}
          submitButton
          withNotice
        />
      </Form>
    </ParaTimeContent>
  )
}
