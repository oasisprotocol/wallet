import { useWalletSlice } from 'app/state/wallet'
import { Box, Form, Heading, Paragraph, FormField, TextArea, Button } from 'grommet'
import { decode } from 'base64-arraybuffer'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'

interface Props {}

const parseKey = (key: string) => {
  try {
    const keyWithoutEnvelope = key
      .replace(/^-----.*$\n?/gm, '')
      .replace(/\n/gm, '')
      .replace(/ /g, '')

    const key_bytes = decode(keyWithoutEnvelope)
    return OasisKey.fromPrivateKey(new Uint8Array(key_bytes))
  } catch (e) {
    throw e
  }
}

export function FromPrivateKey(props: Props) {
  const { t } = useTranslation()
  const walletActions = useWalletSlice().actions
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = React.useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = React.useState(true)

  const onChange = event => setPrivateKey(event.target.value)
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
          {t('openWallet.privateKey.instruction', 'Enter your private key in Base64 format.')}
        </Paragraph>
        <FormField
          htmlFor="privateKey"
          error={privateKeyIsValid === false ? t('openWallet.privateKey.error', 'Invalid private key') : ''}
        >
          <Box border={false}>
            <TextArea
              id="privatekey"
              data-testid="privatekey"
              placeholder={t('openWallet.privateKey.enterPrivateKeyHere', 'Enter your private key here')}
              value={privateKey}
              onChange={onChange}
            />
          </Box>
        </FormField>
        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('openWallet.mnemonic.open', 'Open my wallet')}
              style={{ borderRadius: '4px' }}
              primary
              onClick={onSubmit}
            />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
