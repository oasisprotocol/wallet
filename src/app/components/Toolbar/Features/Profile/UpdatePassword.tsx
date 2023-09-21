import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { Notification } from 'grommet/es6/components/Notification'
import {
  ChoosePasswordInputFields,
  FormValue as ChoosePasswordFieldsFormValue,
} from 'app/components/Persist/ChoosePasswordInputFields'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { persistActions } from 'app/state/persist'
import { selectEnteredWrongPassword, selectLoading } from 'app/state/persist/selectors'

interface FormValue extends ChoosePasswordFieldsFormValue {
  currentPassword?: string
}

const defaultFormValue: FormValue = {
  currentPassword: '',
  password1: '',
  password2: '',
}

export const UpdatePassword = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [notificationVisible, setNotificationVisible] = useState(false)
  const enteredWrongPassword = useSelector(selectEnteredWrongPassword)
  const isProfileReloadingAfterPasswordUpdate = useSelector(selectLoading)
  const [value, setValue] = useState(defaultFormValue)
  const onSubmit = ({ value }: { value: FormValue }) => {
    if (!value.currentPassword || !value.password1) {
      return
    }
    dispatch(
      persistActions.updatePasswordAsync({
        currentPassword: value.currentPassword,
        password: value.password1,
      }),
    )
  }

  useEffect(() => {
    return () => {
      dispatch(persistActions.resetWrongPassword())
    }
  }, [dispatch])

  useEffect(() => {
    // reloading occurs after successful password update
    if (isProfileReloadingAfterPasswordUpdate) {
      setNotificationVisible(true)
      setValue(defaultFormValue)
    }
  }, [isProfileReloadingAfterPasswordUpdate])

  return (
    <Form<FormValue>
      onSubmit={onSubmit}
      {...preventSavingInputsToUserData}
      onChange={nextValue => setValue(nextValue)}
      value={value}
    >
      <Paragraph>
        <label htmlFor="password1">{t('toolbar.profile.password.title', 'Set a new password')}</label>
      </Paragraph>
      <PasswordField<FormValue>
        placeholder={t('toolbar.profile.password.current', 'Current password')}
        inputElementId="currentPassword"
        name="currentPassword"
        validate={value =>
          value ? undefined : t('toolbar.profile.password.enterCurrent', 'Enter your current password')
        }
        error={enteredWrongPassword ? t('persist.loginToProfile.wrongPassword', 'Wrong password') : false}
        required
        showTip={t('persist.loginToProfile.showPassword', 'Show password')}
        hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
        width="medium"
      />
      <ChoosePasswordInputFields />
      <Box direction="row" justify="end" margin={{ top: 'medium' }}>
        <Button primary type="submit" label={t('toolbar.profile.password.submit', 'Update password')} />
      </Box>
      {notificationVisible && (
        <Notification
          toast
          status={'normal'}
          title={t('toolbar.profile.password.success', 'Password updated.')}
          onClose={() => setNotificationVisible(false)}
        />
      )}
    </Form>
  )
}
