import { Lock } from 'grommet-icons/es6/icons/Lock'
import { Unlock } from 'grommet-icons/es6/icons/Unlock'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { settingsActions } from 'app/state/settings/slice'
import { selectScreenPrivacy } from 'app/state/settings/slice/selectors'
import { SelectWithIcon } from '../SelectWithIcon'
import { runtimeIs } from 'app/lib/runtimeIs'
import { setPrivacyScreen } from 'app/lib/privacyScreen'

const getScreenPrivacyIcons = (t: TFunction, size?: string) => ({
  on: <Lock aria-label={t('screenPrivacy.on', 'On')} size={size} />,
  off: <Unlock aria-label={t('screenPrivacy.off', 'Off')} size={size} />,
})

export const ScreenPrivacySelect = () => {
  const { t } = useTranslation()
  const screenPrivacy = useSelector(selectScreenPrivacy)
  const dispatch = useDispatch()
  const icons = getScreenPrivacyIcons(t, '24px')
  const screenPrivacyOptions: { value: 'on' | 'off'; label: string }[] = [
    {
      value: 'on',
      label: t('screenPrivacy.on', 'On'),
    },
    {
      value: 'off',
      label: t('screenPrivacy.off', 'Off'),
    },
  ]

  const handlePrivacyChange = async (newValue: 'on' | 'off') => {
    try {
      await setPrivacyScreen(newValue)
      dispatch(settingsActions.changeScreenPrivacy(newValue))
    } catch (error) {
      console.error('Failed to change privacy screen:', error)
    }
  }

  if (runtimeIs !== 'mobile-app') {
    return null
  }

  return (
    <SelectWithIcon
      label={t('screenPrivacy.title', 'Screen Privacy')}
      id="screenPrivacy"
      name="screenPrivacy"
      icon={icons[screenPrivacy]}
      value={screenPrivacy}
      options={screenPrivacyOptions}
      onChange={handlePrivacyChange}
      tooltip={t(
        'screenPrivacy.tooltip',
        'Prevent sensitive information from being visible in app switchers and when leaving an app.',
      )}
    />
  )
}
