import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Box, CheckBox, Form, FormField, ResponsiveContext, Text } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'
import { selectValidators } from 'app/state/staking/selectors'
import { selectWalletsAddresses } from 'app/state/wallet/selectors'
import { AlertBox } from 'app/components/AlertBox'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

type ConfirmationCheckboxProps = {
  checked: boolean
  description: string
  label: string
  name: string
  warning?: boolean
}

export const ConfirmationCheckbox = ({
  checked,
  description,
  label,
  name,
  warning,
}: ConfirmationCheckboxProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box margin={{ bottom: 'medium' }} style={{ maxWidth: '450px' }}>
      <Box margin={{ bottom: 'small' }} responsive={false}>
        <AlertBox color={warning ? 'status-warning' : 'status-error'}>
          <Text textAlign="center" size={isMobile ? '16px' : 'medium'}>
            {description}
          </Text>
        </AlertBox>
      </Box>
      <FormField name={name} required>
        <CheckBox checked={checked} label={label} name={name} />
      </FormField>
    </Box>
  )
}

export const TransactionConfirmation = () => {
  const { t } = useTranslation()
  const validators = useSelector(selectValidators)
  const walletsAddresses = useSelector(selectWalletsAddresses)
  const {
    isDepositing,
    isEvmcParaTime,
    isLoading,
    paraTimeName,
    setTransactionForm,
    submitTransaction,
    ticker,
    transactionForm,
    usesOasisAddress,
  } = useParaTimes()
  const { navigateToAmount } = useParaTimesNavigation()
  const confirmTransferToValidator =
    usesOasisAddress && validators.some(validator => validator.address === transactionForm.recipient)
  const confirmTransferToForeignAccount =
    !confirmTransferToValidator && usesOasisAddress && !walletsAddresses.includes(transactionForm.recipient)

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
          defaults="You are about to transfer <strong>{{value}} {{ticker}}</strong> tokens {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{paratimeType}} ParaTime to: <strong>{{address}}</strong>"
        />
      }
      isLoading={isLoading}
    >
      <Form
        messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={submitTransaction}
        value={transactionForm}
      >
        {confirmTransferToValidator && (
          <ConfirmationCheckbox
            checked={transactionForm.confirmTransferToValidator}
            description={t(
              'paraTimes.confirmation.confirmTransferToValidatorDescription',
              'This is a validator wallet address. Transfers to this address do not stake your funds with the validator.',
            )}
            label={t(
              'paraTimes.confirmation.confirmTransferToValidatorLabel',
              'I confirm I want to transfer tokens to a validator address',
            )}
            name="confirmTransferToValidator"
          />
        )}

        {confirmTransferToForeignAccount && (
          <ConfirmationCheckbox
            checked={transactionForm.confirmTransferToForeignAccount}
            description={
              isDepositing
                ? t(
                    'paraTimes.confirmation.confirmDepositToForeignAccountDescription',
                    'Destination account is not in your wallet! We recommend you always deposit into your own ParaTime account, then transfer from there.',
                  )
                : t(
                    'paraTimes.confirmation.confirmWithdrawToForeignAccountDescription',
                    'Destination account is not in your wallet! Some automated systems, e.g., those used for tracking exchange deposits, may be unable to accept funds through ParaTime withdrawals. For better compatibility, cancel, withdraw into your own account, and transfer from there.',
                  )
            }
            label={t(
              'paraTimes.confirmation.confirmTransferToForeignAccount',
              'I confirm I want to transfer tokens to a foreign account',
            )}
            name="confirmTransferToForeignAccount"
          />
        )}

        <ConfirmationCheckbox
          checked={transactionForm.confirmTransfer}
          description={
            isDepositing
              ? t(
                  'paraTimes.confirmation.confirmDepositDescription',
                  'Please confirm the transferring amount and the receiving wallet\'s address are correct and then click "Deposit" to make the transfer.',
                )
              : t(
                  'paraTimes.confirmation.confirmWithdrawDescription',
                  'Please confirm the withdrawing amount and the withdrawing wallet\'s address are correct and then click "Withdraw" to make the transfer.',
                )
          }
          label={t(
            'paraTimes.confirmation.confirmTransferLabel',
            'I confirm the amount and the address are correct',
          )}
          name="confirmTransfer"
          warning={true}
        />

        <ParaTimeFormFooter
          primaryLabel={
            isDepositing
              ? t('paraTimes.confirmation.depositLabel', 'Deposit')
              : t('paraTimes.confirmation.withdrawLabel', 'Withdraw')
          }
          secondaryAction={navigateToAmount}
          submitButton
          withNotice={isEvmcParaTime}
        />
      </Form>
    </ParaTimeContent>
  )
}
