import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { validateMnemonic } from 'bip39'
import { Grid, Box, Form, Paragraph, Button, ResponsiveContext } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from 'app/components/Header'
import { MnemonicField } from 'app/components/MnemonicField'

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
      <Grid gap="small" pad="none" columns={size === 'small' ? '100%' : ['1fr', '1fr']}>
        <Form onSubmit={onSubmit}>
          <Header>{t('openWallet.mnemonic.header', 'Enter your keyphrase')}</Header>
          <Paragraph>
            {t(
              'openWallet.mnemonic.instruction',
              'Enter all your keyphrase words below separated by spaces. Most keyphrases are made of either 24 or 12 words.',
            )}
          </Paragraph>
          <MnemonicField
            inputElementId="mnemonic"
            placeholder={t('openWallet.mnemonic.enterPhraseHere', 'Enter your keyphrase here')}
            autoFocus
            value={rawMnemonic}
            onChange={onChange}
            error={
              mnemonicIsValid === false
                ? t(
                    'openWallet.mnemonic.error',
                    'Invalid keyphrase. Please make sure to input the words in the right order, all lowercase.',
                  )
                : ''
            }
          ></MnemonicField>
          <Box direction="row" gap="small" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('openWallet.mnemonic.import', 'Import my wallet')} primary />
            {props.abortHandler && (
              <Button label={t('common.cancel', 'Cancel')} secondary onClick={props.abortHandler} />
            )}
          </Box>
        </Form>
        <Box background="background-contrast">
          <MnemonicGrid mnemonic={mnemonic.split(' ')} />
        </Box>
      </Grid>
    </Box>
  )
}
