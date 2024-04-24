import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { persistActions } from 'app/state/persist'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { LoginModalLayout } from './LoginModalLayout'
import {
  MigratingV0State,
  decryptWithPasswordV0,
  readAndMigrateLanguageV0,
  readStorageV0,
} from '../../../utils/walletExtensionV0'
import { NoTranslate } from '../NoTranslate'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { FormField } from 'grommet/es6/components/FormField'
import { AddressFormatter } from '../AddressFormatter'
import { themeActions } from '../../../styles/theme/slice'
import { RevealOverlayButton } from '../RevealOverlayButton'
import { PrivateKeyFormatter } from '../PrivateKeyFormatter'
import { PasswordWrongError } from '../../../types/errors'
import { CountdownButton } from '../CountdownButton'

export function MigrateV0StateForm() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [enteredWrongPassword, setWrongPassword] = useState(false)
  const [migratingV0State, setMigratingV0State] = useState<undefined | MigratingV0State>(undefined)
  const [hasSavedMnemonic, setHasSavedMnemonic] = useState(false)

  useEffect(() => {
    // Old extension used light theme
    dispatch(themeActions.changeTheme('light'))
  }, [dispatch])

  useEffect(() => {
    // Switch to zh_CN if it was used in old extension. We don't have a language selector in migration UI.
    i18n.changeLanguage(readAndMigrateLanguageV0())
  }, [i18n])

  const onSubmitPassword = async () => {
    setMigratingV0State({
      invalidPrivateKeys: [
        {
          privateKeyWithTypos:
            '86b12cfbcd816983fa2ac199c21b9b217391a7345d85c0c8fc7b715fc8fae19b783f6555015b70642912966317a3b084d0d9670415c45084e750ff5378535737',
          name: 'aa',
          address: 'oasis1qpw6nzr77u5nfucee5wjp544hzgmpjjj2gz5p6zq',
        },
      ],
      mnemonic:
        'world tide monkey club merry globe receive shove filter company rescue present payment purchase blush phone hazard bread chief favorite bracket end mechanic skill',
    })
    return
    const storageV0 = await readStorageV0()
    if (!storageV0) throw new Error('No v0 storage to migrate')
    try {
      setWrongPassword(false)
      const decrypted = await decryptWithPasswordV0(password, storageV0)
      setMigratingV0State(decrypted)
    } catch (err) {
      if (err instanceof PasswordWrongError) {
        setWrongPassword(true)
      } else {
        throw err
      }
    }
  }

  const onSubmitSavedMnemonic = () => {
    if (!migratingV0State) throw new Error('No v0 storage to migrate')
    if (migratingV0State.invalidPrivateKeys.length > 0) {
      setHasSavedMnemonic(true)
    } else {
      onSubmitSavedInvalidPrivateKeys()
    }
  }

  const onSubmitSavedInvalidPrivateKeys = () => {
    finishMigration()
  }

  const finishMigration = () => {
    if (!migratingV0State) throw new Error('No v0 storage to migrate')
    dispatch(
      persistActions.finishV0Migration({
        persistedRootState: migratingV0State.state,
        password: password,
      }),
    )
  }

  return (
    <LoginModalLayout title={t('migrateV0Extension.title', 'Important Wallet Update')}>
      {!migratingV0State && (
        <Form
          onSubmit={onSubmitPassword}
          messages={{ required: t('migrateV0Extension.requiredField', 'This field is required') }}
          {...preventSavingInputsToUserData}
        >
          <Paragraph fill>
            <label htmlFor="password">
              {t(
                'persist.loginToProfile.description',
                'Enter your password to access your existing wallets on this device.',
              )}
            </label>
          </Paragraph>

          <PasswordField
            placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password')}
            name="password"
            inputElementId="password"
            autoFocus
            value={password}
            onChange={event => setPassword(event.target.value)}
            error={enteredWrongPassword ? t('persist.loginToProfile.wrongPassword', 'Wrong password') : false}
            showTip={t('persist.loginToProfile.showPassword', 'Show password')}
            hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
            width="auto"
          ></PasswordField>
          <Box direction="row-responsive" gap="medium" justify="between" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('persist.loginToProfile.unlock', 'Unlock')} primary />
          </Box>
        </Form>
      )}
      {migratingV0State && !hasSavedMnemonic && (
        <Form
          onSubmit={onSubmitSavedMnemonic}
          messages={{ required: t('migrateV0Extension.requiredField', 'This field is required') }}
          {...preventSavingInputsToUserData}
        >
          <Paragraph fill>
            {t(
              'migrateV0Extension.backupMnemonic.description',
              'The new version of the wallet extension will no longer store your mnemonic. This phrase is the only way to restore your account if you have lost access. You now have a final chance to backup your mnemonic.',
            )}
          </Paragraph>

          <RevealOverlayButton
            label={t('migrateV0Extension.backupMnemonic.reveal', 'Tap to show your mnemonic')}
          >
            <Box
              margin={{ vertical: 'small' }}
              pad="small"
              background="background-contrast"
              style={{ wordSpacing: '14px' }}
              width="medium"
            >
              <NoTranslate>
                <strong>{migratingV0State.mnemonic}</strong>
              </NoTranslate>
            </Box>
          </RevealOverlayButton>
          <FormField
            contentProps={{ border: false }}
            required
            name="backupMnemonicConfirm"
            margin={{ vertical: 'medium' }}
          >
            <CheckBox
              name="backupMnemonicConfirm"
              label={t('migrateV0Extension.backupMnemonic.confirm', 'I’ve safely stored my mnemonic')}
            />
          </FormField>
          {migratingV0State.invalidPrivateKeys.length > 0 ? (
            <CountdownButton
              type="submit"
              label={t('migrateV0Extension.nextStep', 'Next')}
              fill="horizontal"
              primary
            />
          ) : (
            <CountdownButton
              type="submit"
              label={t('migrateV0Extension.finishMigration', 'Open the new version of the wallet')}
              fill="horizontal"
              primary
            />
          )}
        </Form>
      )}
      {migratingV0State && hasSavedMnemonic && migratingV0State.invalidPrivateKeys.length > 0 && (
        <Form
          onSubmit={onSubmitSavedInvalidPrivateKeys}
          messages={{ required: t('migrateV0Extension.requiredField', 'This field is required') }}
          {...preventSavingInputsToUserData}
        >
          <>
            {/*
            Workaround for i18next-scanner to pickup plurals correctly, because it is missing
            defaultValue_zero, defaultValue_one, defaultValue_other here:
            https://github.com/i18next/i18next-scanner/blob/4687b6a/src/parser.js#L502-L503
            */}
            {t(
              'migrateV0Extension.backupInvalidPrivateKeys.description_one',
              '1 of your private keys has typos and won’t be stored by the new wallet extension. Please make sure to copy it and store it elsewhere before proceeding, so you can correct it later.',
            ) && null}
          </>
          <Paragraph fill>
            {t(
              'migrateV0Extension.backupInvalidPrivateKeys.description',
              '{{count}} of your private keys have typos and won’t be stored by the new wallet extension. Please make sure to copy them and store them elsewhere before proceeding, so you can correct them later.',
              { count: migratingV0State.invalidPrivateKeys.length },
            )}
          </Paragraph>
          <Box width="medium" gap="large">
            {migratingV0State.invalidPrivateKeys.map(acc => (
              <Box key={acc.privateKeyWithTypos}>
                <AddressFormatter address={acc.address} name={acc.name} />
                <RevealOverlayButton
                  label={t(
                    'migrateV0Extension.backupInvalidPrivateKeys.reveal',
                    'Tap to show invalid private key',
                  )}
                >
                  <PrivateKeyFormatter privateKey={acc.privateKeyWithTypos} />
                </RevealOverlayButton>
              </Box>
            ))}
          </Box>
          <FormField
            contentProps={{ border: false }}
            required
            name="backupInvalidPrivateKeysConfirm"
            margin={{ vertical: 'medium' }}
          >
            <CheckBox
              name="backupInvalidPrivateKeysConfirm"
              label={t(
                'migrateV0Extension.backupInvalidPrivateKeys.confirm',
                'I’ve safely stored my private keys',
              )}
            />
          </FormField>
          <CountdownButton
            type="submit"
            label={t('migrateV0Extension.finishMigration', 'Open the new version of the wallet')}
            fill="horizontal"
            primary
          />
        </Form>
      )}
    </LoginModalLayout>
  )
}
