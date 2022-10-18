import React, { useContext } from 'react'
import { Box, CheckBox, Form, FormField, ResponsiveContext, Text } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const TransactionConfirmation = () => {
  const { t } = useTranslation()
  const { isDepositing, isEvmcParaTime, paraTimeName, setTransactionForm, ticker, transactionForm } =
    useParaTimes()
  const { navigateToAmount, navigateToSummary } = useParaTimesNavigation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.confirmation.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.confirmation.receiving', 'into the receiving')
              : t('paraTimes.confirmation.withdrawing', 'from the withdrawing'),
            address: transactionForm.recipient,
            paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
            paraTime: paraTimeName,
            ticker,
            value: transactionForm.amount,
          }}
          defaults="You are about to transfer <strong>{{value}} {{ticker}}</strong> tokens {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{paratimeType}} ParaTime: <strong>{{address}}</strong>"
        />
      }
    >
      <Box margin={{ bottom: 'medium' }} style={{ maxWidth: '450px' }}>
        <Text textAlign="center" size={isMobile ? '16px' : 'medium'}>
          {isDepositing
            ? t(
                'paraTimes.confirmation.deposit',
                'Please confirm the transferring amount and the receiving wallet\'s address are correct and then click "Deposit" to make the transfer.',
              )
            : t(
                'paraTimes.confirmation.withdraw',
                'Please confirm the withdrawing amount and the withdrawing wallet\'s address are correct and then click "Withdraw" to make the transfer.',
              )}
        </Text>
      </Box>

      <Form
        messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={navigateToSummary}
        value={transactionForm}
      >
        <Box margin={{ bottom: 'small' }} responsive={false}>
          <FormField name="confirmation" required>
            <CheckBox
              checked={transactionForm.confirmation}
              label={t(
                'paraTimes.confirmation.checkboxLabel',
                'I confirm the amount and the address are correct',
              )}
              name="confirmation"
            />
          </FormField>
        </Box>

        <ParaTimeFormFooter
          primaryLabel={
            isDepositing
              ? t('paraTimes.confirmation.depositLabel', 'Deposit')
              : t('paraTimes.confirmation.withdrawLabel', 'Withdraw')
          }
          secondaryAction={navigateToAmount}
          submitButton
          withNotice
        />
      </Form>
    </ParaTimeContent>
  )
}
