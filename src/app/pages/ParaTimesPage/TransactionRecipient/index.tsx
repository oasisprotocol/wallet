import React, { useContext } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { TextInput } from 'grommet/es6/components/TextInput'
import { Trans, useTranslation } from 'react-i18next'
import { isValidAddress } from 'app/lib/helpers'
import { isValidEthAddress, isValidEthPrivateKey, isValidEthPrivateKeyLength } from 'app/lib/eth-helpers'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'

export const TransactionRecipient = () => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const {
    accountAddress,
    clearTransactionForm,
    isDepositing,
    isEvmcParaTime,
    paraTimeName,
    setTransactionForm,
    transactionForm,
    usesOasisAddress,
  } = useParaTimes()
  const { navigateToAmount } = useParaTimesNavigation()
  const addressValidator = usesOasisAddress ? isValidAddress : isValidEthAddress

  return (
    <ParaTimeContent
      description={
        isDepositing ? (
          <Trans
            i18nKey="paraTimes.recipient.depositDescription"
            t={t}
            values={{
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              nextButtonLabel: t('paraTimes.footer.next', 'Next'),
            }}
            defaults='Please enter the recipient address on <strong>{{paraTime}}</strong> {{paratimeType}} and then click "{{nextButtonLabel}}"'
          />
        ) : isEvmcParaTime ? (
          t(
            'paraTimes.recipient.evmcWithdrawDescription',
            'Please enter the private key of the account on ParaTime, the recipient address on consensus and click "{{nextButtonLabel}}"',
            { nextButtonLabel: t('paraTimes.footer.next', 'Next') },
          )
        ) : (
          t(
            'paraTimes.recipient.withdrawDescription',
            'Please enter the recipient address on consensus and click "{{nextButtonLabel}}"',
            { nextButtonLabel: t('paraTimes.footer.next', 'Next') },
          )
        )
      }
    >
      <Form
        messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={navigateToAmount}
        value={transactionForm}
        style={{ width: isMobile ? '100%' : '465px' }}
        {...preventSavingInputsToUserData}
      >
        <Box margin={{ bottom: 'medium' }}>
          {isEvmcParaTime && !isDepositing && (
            <PasswordField
              inputElementId="ethPrivateKey"
              name="ethPrivateKey"
              validate={ethPrivateKey =>
                !isValidEthPrivateKeyLength(ethPrivateKey)
                  ? t(
                      'paraTimes.validation.invalidEthPrivateKeyLength',
                      'Private key should be 64 characters long',
                    )
                  : !isValidEthPrivateKey(ethPrivateKey)
                  ? t(
                      'paraTimes.validation.invalidEthPrivateKey',
                      'Ethereum-compatible private key is invalid',
                    )
                  : undefined
              }
              placeholder={t(
                'paraTimes.recipient.ethPrivateKeyPlaceholder',
                'Enter Ethereum-compatible private key',
              )}
              value={transactionForm.ethPrivateKey}
              showTip={t('openWallet.privateKey.showPrivateKey', 'Show private key')}
              hideTip={t('openWallet.privateKey.hidePrivateKey', 'Hide private key')}
            />
          )}

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
              placeholder={usesOasisAddress ? accountAddress : t('paraTimes.recipient.placeholder', '0x...')}
              value={transactionForm.recipient}
            />
          </FormField>
        </Box>
        <ParaTimeFormFooter
          secondaryAction={clearTransactionForm}
          secondaryLabel={t('paraTimes.selection.cancel', 'Cancel transfer')}
          submitButton
          withNotice={isEvmcParaTime}
        />
      </Form>
    </ParaTimeContent>
  )
}
