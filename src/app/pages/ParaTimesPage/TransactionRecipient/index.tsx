import React, { useContext } from 'react'
import { Box, Form, FormField, ResponsiveContext, TextInput } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'
import { isValidAddress } from 'app/lib/helpers'
import { isValidEthAddress, isValidEthPrivateKey, isValidEthPrivateKeyLength } from 'app/lib/eth-helpers'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const TransactionRecipient = () => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const {
    accountAddress,
    isDepositing,
    isEvmcParaTime,
    paraTimeName,
    setTransactionForm,
    transactionForm,
    usesOasisAddress,
  } = useParaTimes()
  const { navigateToAmount, navigateToDeposit, navigateToWithdraw } = useParaTimesNavigation()
  const addressValidator = usesOasisAddress ? isValidAddress : isValidEthAddress

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.recipient.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.recipient.receiving', 'receiving')
              : t('paraTimes.recipient.withdrawing', 'withdrawing'),
            paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
            paraTime: paraTimeName,
          }}
          defaults='Please enter the address of the {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{paratimeType}} ParaTime and then click "Next"'
        />
      }
    >
      <Form
        messages={{ required: t('paraTimes.validation.required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={navigateToAmount}
        value={transactionForm}
        style={{ width: isMobile ? '100%' : '465px' }}
      >
        <Box margin={{ bottom: 'medium' }}>
          {isEvmcParaTime && !isDepositing ? (
            <FormField
              name="ethPrivateKey"
              required
              validate={(ethPrivateKey: string) =>
                !isValidEthPrivateKeyLength(ethPrivateKey)
                  ? {
                      message: t(
                        'paraTimes.validation.invalidEthPrivateKeyLength',
                        'Private key should be 64 characters long',
                      ),
                      status: 'error',
                    }
                  : !isValidEthPrivateKey(ethPrivateKey)
                  ? {
                      message: t('paraTimes.validation.invalidEthPrivateKey', 'Private key is invalid'),
                      status: 'error',
                    }
                  : undefined
              }
            >
              <TextInput
                name="ethPrivateKey"
                type="password"
                placeholder={t(
                  'paraTimes.recipient.privateKeyPlaceholder',
                  'Enter Ethereum-compatible private key',
                )}
                value={transactionForm.ethPrivateKey}
              />
            </FormField>
          ) : (
            <FormField
              name="recipient"
              required
              validate={(recipient: string) =>
                addressValidator(recipient)
                  ? undefined
                  : { message: t('errors.invalidAddress', 'Invalid address'), status: 'error' }
              }
            >
              <TextInput
                name="recipient"
                placeholder={
                  usesOasisAddress ? accountAddress : t('paraTimes.recipient.placeholder', '0x...')
                }
                value={transactionForm.recipient}
              />
            </FormField>
          )}
        </Box>
        <ParaTimeFormFooter
          secondaryAction={isDepositing ? navigateToDeposit : navigateToWithdraw}
          submitButton
          withNotice
        />
      </Form>
    </ParaTimeContent>
  )
}
