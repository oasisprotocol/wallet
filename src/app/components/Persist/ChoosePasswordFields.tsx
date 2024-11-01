import { selectIsPersistenceUnsupported } from 'app/state/persist/selectors'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { FormField } from 'grommet/es6/components/FormField'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ChoosePasswordInputFields } from './ChoosePasswordInputFields'
import { runtimeIs } from 'config'

export function ChoosePasswordFields() {
  const { t } = useTranslation()
  const unlockedStatus = useSelector(selectUnlockedStatus)
  const isPersistenceUnsupported = useSelector(selectIsPersistenceUnsupported)
  const hasUnpersistedAccounts = unlockedStatus === 'openUnpersisted'
  const [startPersisting, setStartPersisting] = useState(!hasUnpersistedAccounts)

  const isExtension = runtimeIs === 'extension'

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
    <Box as="fieldset" margin={{ top: 'medium' }} pad="medium">
      <FormField contentProps={{ border: false, pad: 'none' }} margin={{ top: 'xsmall' }}>
        <CheckBox
          label={<Text>{t('persist.createProfile.startPersistingToggle', 'Create a profile')}</Text>}
          toggle
          onChange={event => setStartPersisting(event.target.checked)}
          {...(isChoiceDisabled
            ? {
                disabled: true,
                checked: unlockedStatus === 'unlockedProfile',
              }
            : isExtension
            ? {
                disabled: true,
                // Force creating a profile in Manifest v3 extension because we can't keep state in memory
                checked: true,
              }
            : {
                checked: startPersisting,
              })}
        ></CheckBox>
      </FormField>
      <Paragraph size="small" fill>
        {t(
          'persist.createProfile.startPersisting',
          'Store your private keys locally and protect them with a password by creating a profile.',
        )}
      </Paragraph>

      {isChoosingPassword && (
        <>
          <ChoosePasswordInputFields
            password1Placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password')}
            password2Placeholder={t('persist.createProfile.repeatPassword', 'Confirm your password')}
          />

          <FormField
            name="profileStorageUndependableAcknowledge"
            validate={(value: boolean) =>
              value ? undefined : t('persist.createProfile.requiredField', 'This field is required')
            }
            contentProps={{
              border: false,
              pad: 'none',
            }}
            margin={{ top: 'xsmall' }}
          >
            <CheckBox
              name="profileStorageUndependableAcknowledge"
              label={
                <Paragraph size="small" fill>
                  {t(
                    'persist.createProfile.undependableAcknowledge',
                    'I understand this password and profile do not substitute my mnemonic.',
                  )}
                </Paragraph>
              }
            ></CheckBox>
          </FormField>
        </>
      )}
    </Box>
  )
}
