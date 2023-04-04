import { Box, Button, Form, Layer, Paragraph } from 'grommet'
import { persistActions } from 'app/state/persist'
import { selectEnteredWrongPassword } from 'app/state/persist/selectors'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { PasswordField } from 'app/components/PasswordField'
import { Header } from 'app/components/Header'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { useNavigate } from 'react-router-dom'

export function UnlockForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const enteredWrongPassword = useSelector(selectEnteredWrongPassword)
  const [password, setPassword] = React.useState('')

  const onSubmit = () => dispatch(persistActions.unlockAsync({ password: password }))

  return (
    <Layer modal background="background-front">
      <Box pad="medium" gap="medium" direction="row" align="center" responsive={false}>
        <Form onSubmit={onSubmit} {...preventSavingInputsToUserData}>
          <Header>{t('persist.loginToProfile.title', 'Welcome Back!')}</Header>
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

            <Button
              label={t('persist.loginToProfile.skipUnlocking', 'Continue without the profile')}
              onClick={() => {
                navigate('/')
                dispatch(persistActions.skipUnlocking())
              }}
              plain
            />
          </Box>

          <Box direction="row" margin={{ top: 'large' }}>
            <Button
              label={t('persist.loginToProfile.eraseProfile', 'Erase profile')}
              onClick={() => {
                // TODO: improve UX
                if (window.confirm('Are you sure?')) {
                  navigate('/')
                  dispatch(persistActions.eraseAsync())
                }
              }}
              plain
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}
