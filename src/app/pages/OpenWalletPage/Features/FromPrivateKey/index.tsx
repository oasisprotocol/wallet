import { walletActions } from 'app/state/wallet'
import { Box } from 'grommet/es6/components/Box'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { Button } from 'grommet/es6/components/Button'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { Header } from 'app/components/Header'
import { ChoosePasswordFields } from 'app/components/Persist/ChoosePasswordFields'
import { FormValue as ChoosePasswordFieldsFormValue } from 'app/components/Persist/ChoosePasswordInputFields'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { isValidEthPrivateKey, stripHexPrefix } from 'app/lib/eth-helpers'

interface Props {}

interface FormValue extends ChoosePasswordFieldsFormValue {
  privateKey: string
}

const isValidKey = (privateKey: string) => {
  try {
    OasisKey.fromBase64PrivateKey(privateKey)
    return true
  } catch (e) {
    return false
  }
}

export function FromPrivateKey(props: Props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onSubmit = ({ value }: { value: FormValue }) => {
    const secret = OasisKey.fromBase64PrivateKey(value.privateKey)
    dispatch(
      walletActions.openWalletFromPrivateKey({
        privateKey: uint2hex(secret),
        choosePassword: value.password2,
      }),
    )
  }

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Form<FormValue> onSubmit={onSubmit} {...preventSavingInputsToUserData}>
        <Header>{t('openWallet.privateKey.header', 'Enter your private key')}</Header>
        <Paragraph>
          <label htmlFor="privatekey">
            {t('openWallet.privateKey.instruction', 'Enter your private key in Base64 format.')}
          </label>
        </Paragraph>

        <PasswordField<FormValue>
          inputElementId="privatekey"
          name="privateKey"
          placeholder={t('openWallet.privateKey.enterPrivateKeyHere', 'Enter your private key here')}
          autoFocus
          validate={privateKey =>
            isValidKey(privateKey)
              ? undefined
              : isValidEthPrivateKey(stripHexPrefix(privateKey))
              ? t(
                  'openWallet.privateKey.errorKeyIsInEthFormat',
                  'This input is intended for Oasis Consensus private keys. The private key you entered looks like an Ethereum-compatible private key (e.g. from MetaMask for Sapphire). If you want to use your Ethereum-compatible private key to move ROSE from Sapphire to Consensus, click "{{paratimesMenu}}", then "{{withdrawButton}}", and paste it there.',
                  {
                    paratimesMenu: t('menu.paraTimes', 'ParaTimes'),
                    withdrawButton: t('paraTimes.transfers.withdraw', 'Withdraw from ParaTime'),
                  },
                )
              : t('openWallet.privateKey.error', 'Invalid private key')
          }
          showTip={t('openWallet.privateKey.showPrivateKey', 'Show private key')}
          hideTip={t('openWallet.privateKey.hidePrivateKey', 'Hide private key')}
          width="xlarge"
        />

        <ChoosePasswordFields />

        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('openWallet.mnemonic.import', 'Import my wallet')} primary />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
