import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { persistActions } from 'app/state/persist'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { LoginModalLayout } from './LoginModalLayout'
import { MigratingV0State, decryptWithPasswordV0, readStorageV0 } from '../../../utils/walletExtensionV0'
import { NoTranslate } from '../NoTranslate'
import { uintToBase64, hex2uint } from '../../lib/helpers'

export function MigrateV0StateForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [enteredWrongPassword, setWrongPassword] = useState(false)
  const [migratingV0State, setMigratingV0State] = useState<undefined | MigratingV0State>(undefined)
  const [hasSavedMnemonic, setHasSavedMnemonic] = useState(false)

  const onSubmitPassword = async () => {
    const storageV0 = await readStorageV0()
    if (!storageV0) throw new Error('No v0 storage to migrate')
    const decryptedPromise = decryptWithPasswordV0(password, storageV0)
    const enteredWrongPassword = await decryptedPromise.then(
      () => false,
      () => true,
    )
    setWrongPassword(enteredWrongPassword)
    if (enteredWrongPassword) return

    const decrypted = await decryptedPromise
    setMigratingV0State(decrypted)
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
  }

  return (
    <LoginModalLayout title={t('migrateV0Extension.title', 'Important Wallet Update')}>
      {!migratingV0State && (
        <Form onSubmit={onSubmitPassword} {...preventSavingInputsToUserData}>
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
        <Form onSubmit={onSubmitSavedMnemonic} {...preventSavingInputsToUserData}>
          <Paragraph>
            {t(
              'migrateV0Extension.backupMnemonic.description',
              'The new version of the wallet extension will no longer store your mnemonic. This phrase is the only way to restore your account if you have lost access. You now have a final chance to backup your mnemonic.',
            )}
          </Paragraph>
          <Paragraph>{t('migrateV0Extension.backupMnemonic.reveal', 'Tap to show your mnemonic')}</Paragraph>
          {migratingV0State.mnemonic}
          <Paragraph>
            {t('migrateV0Extension.backupMnemonic.confirm', 'I’ve safely stored my mnemonic')}
          </Paragraph>
          <Button type="submit" label={t('migrateV0Extension.nextStep', 'Next')} primary />
        </Form>
      )}
      {migratingV0State && hasSavedMnemonic && migratingV0State.invalidPrivateKeys.length > 0 && (
        <Form onSubmit={onSubmitSavedInvalidPrivateKeys} {...preventSavingInputsToUserData}>
          <Paragraph>
            {t(
              'migrateV0Extension.backupInvalidPrivateKeys.description',
              'We found invalid private keys in the existing storage. The new version of the wallet extension will no longer store them. You now have a final chance to make a backup, so you can try to correct them later.',
            )}
          </Paragraph>
          <Paragraph>{t('migrateV0Extension.backupInvalidPrivateKeys.reveal', 'Tap to show')}</Paragraph>
          {migratingV0State.invalidPrivateKeys.map(acc => (
            <Box key={acc.privateKeyWithTypos}>
              {acc.name} ({acc.address})
              <Box round="5px" border={{ color: 'brand' }} pad="small" style={{ display: 'block' }}>
                <NoTranslate>{uintToBase64(hex2uint(acc.privateKeyWithTypos))}</NoTranslate>
              </Box>
            </Box>
          ))}
          <Paragraph>
            {t(
              'migrateV0Extension.backupInvalidPrivateKeys.confirm',
              'I’ve safely stored invalid private keys',
            )}
          </Paragraph>
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
