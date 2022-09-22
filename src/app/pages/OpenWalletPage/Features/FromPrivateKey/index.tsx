import { walletActions } from 'app/state/wallet'
import { Box, Form, Heading, Paragraph, FormField, Button, TextInput, Tip } from 'grommet'
import { View, Hide } from 'grommet-icons/icons'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { base64ToUint, uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'

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

export function FromPrivateKey(props: Props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = React.useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = React.useState(true)
  const [privateKeyIsVisible, setPrivateKeyIsVisible] = React.useState(false)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)
  const onSubmit = () => {
    try {
      const secret = parseKey(privateKey)
      setPrivateKeyIsValid(true)
      dispatch(walletActions.openWalletFromPrivateKey(uint2hex(secret)))
    } catch (e) {
      setPrivateKeyIsValid(false)
    }
  }

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Form>
        <Heading margin="0">{t('openWallet.privateKey.header', 'Enter your private key')}</Heading>
        <Paragraph>
          <label htmlFor="privatekey">
            {t('openWallet.privateKey.instruction', 'Enter your private key in Base64 format.')}
          </label>
        </Paragraph>
        <PasswordField></PasswordField>
        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('openWallet.mnemonic.import', 'Import my account')}
              primary
              onClick={onSubmit}
            />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
