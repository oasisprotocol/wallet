import { selectIsPersistenceUnsupported } from 'app/state/persist/selectors'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { Box } from 'grommet/es6/components/Box'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { FormField } from 'grommet/es6/components/FormField'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ChoosePasswordInputFields } from './ChoosePasswordInputFields'

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
          <ChoosePasswordInputFields
            password1Placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password')}
            password2Placeholder={t('persist.createProfile.repeatPassword', 'Re-enter your password')}
          />
        </>
      )}
    </Box>
  )
}
