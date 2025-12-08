import { Lock } from 'grommet-icons/es6/icons/Lock'
import { Unlock } from 'grommet-icons/es6/icons/Unlock'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { SelectWithIcon } from '../SelectWithIcon'
import { runtimeIs } from 'app/lib/runtimeIs'

const getScreenPrivacyIcons = (t: TFunction, size?: string) => ({
  on: <Lock aria-label={t('screenPrivacy.on', 'On')} size={size} />,
  off: <Unlock aria-label={t('screenPrivacy.off', 'Off')} size={size} />,
})

export const ScreenPrivacySelect = () => {
  const { t } = useTranslation()
  const currentValue = 'on'
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

  if (runtimeIs !== 'mobile-app') {
    return null
  }

  return (
    <SelectWithIcon
      label={t('screenPrivacy.title', 'Screen Privacy')}
      id="screenPrivacy"
      name="screenPrivacy"
      icon={icons[currentValue]}
      value={currentValue}
      options={screenPrivacyOptions}
      onChange={value => console.log('change', value)}
    />
  )
}
