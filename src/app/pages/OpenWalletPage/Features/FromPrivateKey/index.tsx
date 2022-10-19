import { walletActions } from 'app/state/wallet'
import { Box, Form, Paragraph, Button } from 'grommet'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { base64ToUint, uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { Header } from 'app/components/Header'

interface Props {}

const parseKey = (key: string) => {
  const keyWithoutEnvelope = key
    .replace(/\n/gm, '')
    .replace(/ /g, '')
    .replace(/^-----.*?-----/, '')
    .replace(/-----.*?-----$/, '')

  const key_bytes = base64ToUint(keyWithoutEnvelope)
  return OasisKey.fromPrivateKey(key_bytes)
}

const isValidKey = (privateKey: string) => {
  try {
    parseKey(privateKey)
    return true
  } catch (e) {
    return false
  }
}

export function FromPrivateKey(props: Props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = React.useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)
  const onSubmit = () => {
    const secret = parseKey(privateKey)
    dispatch(walletActions.openWalletFromPrivateKey(uint2hex(secret)))
  }

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Form onSubmit={onSubmit}>
        <Header>{t('openWallet.privateKey.header', 'Enter your private key')}</Header>
        <Paragraph>
          <label htmlFor="privatekey">
            {t('openWallet.privateKey.instruction', 'Enter your private key in Base64 format.')}
          </label>
        </Paragraph>

        <PasswordField
          inputElementId="privatekey"
          name="privateKey"
          placeholder={t('openWallet.privateKey.enterPrivateKeyHere', 'Enter your private key here')}
          autoComplete="off"
          value={privateKey}
          onChange={onChange}
          validate={privateKey =>
            isValidKey(privateKey) ? undefined : t('openWallet.privateKey.error', 'Invalid private key')
          }
          showTip={t('openWallet.privateKey.showPrivateKey', 'Show private key')}
          hideTip={t('openWallet.privateKey.hidePrivateKey', 'Hide private key')}
          width="auto"
        />

        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('openWallet.mnemonic.import', 'Import my account')} primary />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
