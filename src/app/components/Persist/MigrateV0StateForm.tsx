import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { persistActions } from 'app/state/persist'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { LoginModalLayout } from './LoginModalLayout'
import { MigratingV0State, decryptWithPasswordV0, readStorageV0 } from '../../../utils/walletExtensionV0'
import { NoTranslate } from '../NoTranslate'
import { uintToBase64, hex2uint } from '../../lib/helpers'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { FormField } from 'grommet/es6/components/FormField'
import { AddressFormatter } from '../AddressFormatter'
import { themeActions } from '../../../styles/theme/slice'
import { PasswordWrongError } from '../../../types/errors'

export function MigrateV0StateForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [enteredWrongPassword, setWrongPassword] = useState(false)
  const [migratingV0State, setMigratingV0State] = useState<undefined | MigratingV0State>(undefined)
  const [hasSavedMnemonic, setHasSavedMnemonic] = useState(false)

  useEffect(() => {
    // Old extension used light theme
    dispatch(themeActions.changeTheme('light'))
  }, [dispatch])

  const onSubmitPassword = async () => {
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
      persistActions.setUnlockedRootState({
        persistedRootState: migratingV0State.state,
        stringifiedEncryptionKey: 'skipped',
      }),
    )
    dispatch(persistActions.setPasswordAsync({ password }))
    // TODO: Delete V0 profile
  }

  return (
    <LoginModalLayout title={t('migrateV0Extension.title', 'Important Wallet Update')}>
      {!migratingV0State && (
        <Form
          onSubmit={onSubmitPassword}
          messages={{ required: t('migrateV0Extension.requiredField', 'This field is required') }}
          {...preventSavingInputsToUserData}
        >
          <Paragraph>
            <label htmlFor="password">
              {t(
                'persist.loginToProfile.description',
                'Log into your existing user profile on this computer to access the wallets you already added.',
              )}
            </label>
          </Paragraph>

          <PasswordField
            placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')}
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
          <Paragraph>
            {t(
              'migrateV0Extension.backupMnemonic.description',
              'The new version of the wallet extension will no longer store your mnemonic. This phrase is the only way to restore your account if you have lost access. You now have a final chance to backup your mnemonic.',
            )}
          </Paragraph>
          <Button label={t('migrateV0Extension.backupMnemonic.reveal', 'Tap to show your mnemonic')} />

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
          <FormField contentProps={{ border: false }} required name="backupMnemonicConfirm">
            <CheckBox
              name="backupMnemonicConfirm"
              label={t('migrateV0Extension.backupMnemonic.confirm', 'I’ve safely stored my mnemonic')}
            />
          </FormField>
          {migratingV0State.invalidPrivateKeys.length > 0 ? (
            <Button type="submit" label={t('migrateV0Extension.nextStep', 'Next')} primary />
          ) : (
            <Button
              type="submit"
              label={t('migrateV0Extension.finishMigration', 'Open the new version of the wallet')}
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
          <Paragraph>
            {t(
              'migrateV0Extension.backupInvalidPrivateKeys.description',
              'Some of your private keys have typos and won’t be stored by the new wallet extension. Please make sure to copy them and store them elsewhere before proceeding.',
            )}
          </Paragraph>
          <Button
            label={t(
              'migrateV0Extension.backupInvalidPrivateKeys.reveal',
              'Tap to show invalid private keys',
            )}
          />
          <Box width="medium">
            {migratingV0State.invalidPrivateKeys.map(acc => (
              <Box key={acc.privateKeyWithTypos}>
                <AddressFormatter address={acc.address} name={acc.name} />
                <Box round="5px" border={{ color: 'brand' }} pad="small" style={{ display: 'block' }}>
                  <NoTranslate>{uintToBase64(hex2uint(acc.privateKeyWithTypos))}</NoTranslate>
                </Box>
              </Box>
            ))}
          </Box>
          <FormField contentProps={{ border: false }} required name="backupInvalidPrivateKeysConfirm">
            <CheckBox
              name="backupInvalidPrivateKeysConfirm"
              label={t(
                'migrateV0Extension.backupInvalidPrivateKeys.confirm',
                'I’ve safely stored invalid private keys',
              )}
            />
          </FormField>
          <Button
            type="submit"
            label={t('migrateV0Extension.finishMigration', 'Open the new version of the wallet')}
            primary
          />
        </Form>
      )}
    </LoginModalLayout>
  )
}
