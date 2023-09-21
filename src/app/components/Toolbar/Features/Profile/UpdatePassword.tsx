import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import {
  ChoosePasswordInputFields,
  FormValue as ChoosePasswordFieldsFormValue,
} from 'app/components/Persist/ChoosePasswordInputFields'
import { PasswordField } from 'app/components/PasswordField'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { persistActions } from 'app/state/persist'
import { selectEnteredWrongPassword } from 'app/state/persist/selectors'

interface FormValue extends ChoosePasswordFieldsFormValue {
  currentPassword?: string
}

export const UpdatePassword = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const enteredWrongPassword = useSelector(selectEnteredWrongPassword)
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

  return (
    <Form<FormValue> onSubmit={onSubmit} {...preventSavingInputsToUserData}>
      <Paragraph>
        <label htmlFor="password1">{t('toolbar.profile.setPassword', 'Set a new password')}</label>
      </Paragraph>
      <PasswordField<FormValue>
        placeholder={t('toolbar.profile.currentPassword', 'Current password')}
        inputElementId="currentPassword"
        name="currentPassword"
        validate={value =>
          value ? undefined : t('toolbar.profile.enterCurrentPassword', 'Enter your current password')
        }
        error={enteredWrongPassword ? t('persist.loginToProfile.wrongPassword', 'Wrong password') : false}
        required
        showTip={t('toolbar.profile.showPassword', 'Show password')}
        hideTip={t('toolbar.profile.hidePassword', 'Hide password')}
        width="medium"
      />
      <ChoosePasswordInputFields />
      <Box direction="row" justify="end" margin={{ top: 'medium' }}>
        <Button primary type="submit" label={t('toolbar.profile.update', 'Update password')} />
      </Box>
    </Form>
  )
}
