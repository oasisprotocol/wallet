import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { validateMnemonic } from 'bip39'
import { Grid } from 'grommet/es6/components/Grid'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { useEffect, useState, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from 'app/components/Header'
import { MnemonicField } from 'app/components/MnemonicField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { runtimeIs } from 'app/lib/runtimeIs'

interface Props {
  /** Called once the mnemonic is confirmed */
  successHandler: (mnemonic: string) => void
  /** Adds a cancel button */
  abortHandler?: () => void
}

export function MnemonicValidation(props: Props) {
  const { t } = useTranslation()

  const [rawMnemonic, setRawMnemonic] = useState('')
  const [mnemonicIsValid, setMnemonicIsValid] = useState(true)
  const size = useContext(ResponsiveContext)
  const mnemonicFieldBoxRef = useRef<HTMLDivElement>(null)

  const mnemonic = rawMnemonic.trim().replace(/[ \n]+/g, ' ')
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawMnemonic(event.target.value)
  }

  useEffect(() => {
    if (runtimeIs !== 'mobile-app') {
      return
    }
    const wordCount = rawMnemonic.split(' ').length
    if (wordCount === 8 && mnemonicFieldBoxRef.current) {
      mnemonicFieldBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [rawMnemonic])

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
        <Form onSubmit={onSubmit} {...preventSavingInputsToUserData}>
          <Header>{t('openWallet.mnemonic.header', 'Enter your mnemonic')}</Header>
          <Paragraph>
            {t(
              'openWallet.mnemonic.instruction',
              'Enter all your mnemonic words below separated by spaces. Most mnemonics are made of either 24 or 12 words.',
            )}
          </Paragraph>
          <Box ref={mnemonicFieldBoxRef} style={{ scrollMarginTop: '70px' }}>
            <MnemonicField
              inputElementId="mnemonic"
              placeholder={t('openWallet.mnemonic.enterPhraseHere', 'Enter your mnemonic here')}
              autoFocus
              value={rawMnemonic}
              onChange={onChange}
              error={
                mnemonicIsValid === false
                  ? t(
                      'openWallet.mnemonic.error',
                      'Invalid mnemonic. Please make sure to input the words in the right order, all lowercase.',
                    )
                  : ''
              }
            ></MnemonicField>
          </Box>
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
