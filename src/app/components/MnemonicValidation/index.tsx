import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { validateMnemonic } from 'bip39'
import { Grid, Box, Form, Heading, Paragraph, FormField, TextArea, Button, ResponsiveContext } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  /** Called once the mnemonic is confirmed */
  successHandler: (mnemonic: string) => void
  /** Adds a cancel button */
  abortHandler?: () => void
}

export function MnemonicValidation(props: Props) {
  const { t } = useTranslation()

  const [rawMnemonic, setRawMnemonic] = React.useState('')
  const [mnemonicIsValid, setMnemonicIsValid] = React.useState(true)
  const size = React.useContext(ResponsiveContext)

  const mnemonic = rawMnemonic.trim().replace(/[ \n]+/g, ' ')
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawMnemonic(event.target.value)
  }
  const onSubmit = () => {
    const isValid = validateMnemonic(mnemonic)
    setMnemonicIsValid(isValid)

    if (isValid) {
      props.successHandler(mnemonic)
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
      <Grid gap="small" pad="small" columns={size === 'small' ? '100%' : ['1fr', '1fr']}>
        <Box margin={{ left: 'small', vertical: 'small', right: 'large' }}>
          <Form>
            <Heading margin="0">{t('openWallet.mnemonic.header', 'Enter your keyphrase')}</Heading>
            <Paragraph>
              {t(
                'openWallet.mnemonic.instruction',
                'Enter all your keyphrase words below separated by spaces. Most keyphrases are made of either 24 or 12 words.',
              )}
            </Paragraph>
            <Box border={false}>
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
                <Box border={false}>
                  <TextArea
                    id="mnemonic"
                    data-testid="mnemonic"
                    placeholder={t('openWallet.mnemonic.enterPhraseHere', 'Enter your keyphrase here')}
                    size="medium"
                    rows={5}
                    value={rawMnemonic}
                    onChange={onChange}
                    fill
                  />
                </Box>
              </FormField>
            </Box>
            <Box direction="row" gap="small" margin={{ top: 'medium' }}>
              <Button
                type="submit"
                label={t('openWallet.mnemonic.open', 'Open my wallet')}
                style={{ borderRadius: '4px' }}
                primary
                onClick={onSubmit}
              />
              {props.abortHandler && (
                <Button
                  label={t('common.cancel', 'Cancel')}
                  style={{ borderRadius: '4px' }}
                  secondary
                  onClick={props.abortHandler}
                />
              )}
            </Box>
          </Form>
        </Box>
        <Box background="background-contrast">
          <MnemonicGrid mnemonic={mnemonic.split(' ')} />
        </Box>
      </Grid>
    </Box>
  )
}
