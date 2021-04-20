import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { useWalletSlice } from 'app/pages/WalletPage/slice'
import { validateMnemonic } from 'bip39'
import { Grid, Box, Form, Heading, Paragraph, FormField, TextArea, Button } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

interface Props {}

export function FromMnemonic(props: Props) {
  const { t } = useTranslation()
  const walletActions = useWalletSlice().actions
  const dispatch = useDispatch()

  const [mnemonic, setMnemonic] = React.useState('')
  const [mnemonicIsValid, setMnemonicIsValid] = React.useState(true)

  const onChange = event => setMnemonic(event.target.value.replaceAll('\n', ''))
  const onSubmit = () => {
    const trimmedMnemonic = mnemonic.trim()
    const isValid = validateMnemonic(trimmedMnemonic)
    setMnemonicIsValid(isValid)

    if (isValid === true) {
      dispatch(walletActions.openWalletFromMnemonic(trimmedMnemonic))
    }
  }

  return (
    <Box
      background="white"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'light-3', size: '1px' }}
    >
      <Grid gap="small" pad="small" columns={['2fr', '2fr']}>
        <Box margin={{ left: 'small', vertical: 'small', right: 'large' }}>
          <Form>
            <Heading margin="0">{t('openWallet.mnemonic.header', 'Enter your keyphrase')}</Heading>
            <Paragraph>
              {t(
                'openWallet.mnemonic.instruction',
                'Enter your 12, 18 or 24 words keyphrase below, each words separated by spaces.',
              )}
            </Paragraph>
            <Box border={false} height="140px">
              <FormField
                htmlFor="mnemonic"
                error={
                  mnemonicIsValid === false
                    ? t(
                        'openWallet.mnemonic.error',
                        'Invalid keyphrase. Please make sure to input the words in the right order, all lowercase.',
                      )
                    : ''
                }
              >
                <Box border={false} height="100px">
                  <TextArea
                    id="mnemonic"
                    data-testid="mnemonic"
                    placeholder={t('openWallet.mnemonic.enterPhraseHere', 'Enter your keyphrase here')}
                    size="medium"
                    value={mnemonic}
                    onChange={onChange}
                    fill
                  />
                </Box>
              </FormField>
            </Box>
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
        <Box background="light-5">
          <MnemonicGrid mnemonic={mnemonic} />
        </Box>
      </Grid>
    </Box>
  )
}
