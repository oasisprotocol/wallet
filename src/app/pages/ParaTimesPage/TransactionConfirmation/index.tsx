import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Box } from 'grommet/es6/components/Box'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
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
        isDepositing ? (
          <Trans
            i18nKey="paraTimes.confirmation.depositDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="You are about to deposit <strong>{{value}} {{ticker}}</strong> to <strong>{{address}}</strong> on <strong>{{paraTime}}</strong> {{paratimeType}}"
          />
        ) : (
          <Trans
            i18nKey="paraTimes.confirmation.withdrawDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="You are about to withdraw <strong>{{value}} {{ticker}}</strong> from <strong>{{paraTime}}</strong> {{paratimeType}} to <strong>{{address}}</strong>"
          />
        )
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
              'This is a validator wallet address. Transfers to this address do not stake your funds to the validator.',
            )}
            label={t(
              'paraTimes.confirmation.confirmTransferToValidatorLabel',
              'I confirm I want to transfer {{ticker}} to a validator address',
              {
                ticker,
              },
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
                    'Destination address does not match any of the accounts in your wallet! Some services such as exchanges, may not support direct deposits to fund your account. For better compatibility, we strongly recommend that you first deposit to your ParaTime account and then transfer {{ticker}} to the destination address.',
                    {
                      ticker,
                    },
                  )
                : t(
                    'paraTimes.confirmation.confirmWithdrawToForeignAccountDescription',
                    'Destination address does not match any of the accounts in your wallet! Some services such as exchanges, may not support direct withdrawals to fund the account. For better compatibility, we strongly recommend that you first withdraw to your consensus account and then transfer {{ticker}} to the destination address.',
                    {
                      ticker,
                    },
                  )
            }
            label={t(
              'paraTimes.confirmation.confirmTransferToForeignAccount',
              'I confirm I want to directly withdraw to an external account',
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
                  'Please confirm the deposit amount and the recipient address are correct and then click "Deposit".',
                )
              : t(
                  'paraTimes.confirmation.confirmWithdrawDescription',
                  'Please confirm the withdrawal amount and the recipient address are correct and then click "Withdraw".',
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
