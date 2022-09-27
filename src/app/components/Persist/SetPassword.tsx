import { PasswordField } from 'app/components/PasswordField'
import { persistActions } from 'app/state/persist'
import { selectIsPersistenceUnsupported, selectHasPersistedProfiles } from 'app/state/persist/selectors'
import { Box, Button, Form, Paragraph } from 'grommet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface FormData {
  password1: string
  password2: string
}

export function SetPassword() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hasPersistedProfiles = useSelector(selectHasPersistedProfiles)
  const isPersistenceUnsupported = useSelector(selectIsPersistenceUnsupported)

  if (isPersistenceUnsupported) {
    return <p>{t('persist.createProfile.unsupported', 'Persistence is not supported in this browser.')}</p>
  }
  if (hasPersistedProfiles) {
    return <></>
  }

  const onSubmit = ({value}: {value: FormData}) => {
    dispatch(persistActions.setPasswordAsync({ password: value.password2 }))
  }

  return (
    <Form<FormData> onSubmit={onSubmit}>
      <Paragraph>
        <label htmlFor="password1">{t('persist.createProfile.choosePassword', 'Choose a password')}</label>
      </Paragraph>

      <PasswordField<FormData>
        placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')}
        inputElementId="password1"
        name="password1"
        autoComplete="new-password"
        validate={value =>
          value ? undefined : t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')
        }
        required
        showTip={t('persist.loginToProfile.showPassword', 'Show password')}
        hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
        width="medium"
      ></PasswordField>

      <PasswordField<FormData>
        placeholder={t('persist.createProfile.repeatPassword', 'Re-enter your password')}
        inputElementId="password2"
        name="password2"
        autoComplete="new-password"
        validate={(value, form) =>
          form.password1 !== form.password2
            ? t('persist.createProfile.passwordMismatch', 'Entered password does not match')
            : undefined
        }
        showTip={t('persist.loginToProfile.showPassword', 'Show password')}
        hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
        width="medium"
      ></PasswordField>

      <Box direction="row" justify="between" margin={{ top: 'medium' }}>
        <Button type="submit" label={t('persist.createProfile.setPassword', 'Create profile')} primary />
      </Box>
    </Form>
  )
}
