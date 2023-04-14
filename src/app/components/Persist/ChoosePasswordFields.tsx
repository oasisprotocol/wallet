import { PasswordField } from 'app/components/PasswordField'
import { selectIsPersistenceUnsupported } from 'app/state/persist/selectors'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { Box } from 'grommet/es6/components/Box'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { FormField } from 'grommet/es6/components/FormField'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export interface FormValue {
  password1?: string
  /**
   * Undefined if:
   * - persistence is unsupported
   * - or is already persisting (unlocked) or skipped unlocking
   * - or didn't opt to start persisting
   */
  password2?: string
}

export function ChoosePasswordFields() {
  const { t } = useTranslation()
  const unlockedStatus = useSelector(selectUnlockedStatus)
  const isPersistenceUnsupported = useSelector(selectIsPersistenceUnsupported)
  const [startPersisting, setStartPersisting] = useState(false)

  const isChoiceDisabled =
    isPersistenceUnsupported ||
    unlockedStatus === 'unlockedProfile' ||
    unlockedStatus === 'emptySkippedUnlockingProfile' ||
    unlockedStatus === 'openSkippedUnlockingProfile'

  const isChoosingPassword = !isChoiceDisabled && startPersisting

  if (isPersistenceUnsupported) {
    return <p>{t('persist.createProfile.unsupported', 'Persistence is not supported in this browser.')}</p>
  }

  return (
    <Box as="fieldset" margin={{ top: 'medium' }}>
      <FormField contentProps={{ border: false }} margin={{ top: 'xsmall' }}>
        <CheckBox
          label={t(
            'persist.createProfile.startPersisting',
            'Store private keys locally, protected by a password',
          )}
          onChange={event => setStartPersisting(event.target.checked)}
          {...(isChoiceDisabled
            ? {
                disabled: true,
                checked: unlockedStatus === 'unlockedProfile',
              }
            : {
                checked: startPersisting,
              })}
        ></CheckBox>
      </FormField>

      {isChoosingPassword && (
        <>
          <Paragraph>
            <label htmlFor="password1">
              {t('persist.createProfile.choosePassword', 'Choose a password')}
            </label>
          </Paragraph>

          <PasswordField<FormValue>
            placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')}
            inputElementId="password1"
            name="password1"
            validate={value =>
              value ? undefined : t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')
            }
            required
            showTip={t('persist.loginToProfile.showPassword', 'Show password')}
            hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
            width="medium"
          ></PasswordField>

          <PasswordField<FormValue>
            placeholder={t('persist.createProfile.repeatPassword', 'Re-enter your password')}
            inputElementId="password2"
            name="password2"
            validate={(value, form) =>
              form.password1 !== form.password2
                ? t('persist.createProfile.passwordMismatch', 'Entered password does not match')
                : undefined
            }
            showTip={t('persist.loginToProfile.showPassword', 'Show password')}
            hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
            width="medium"
          ></PasswordField>
        </>
      )}
    </Box>
  )
}
