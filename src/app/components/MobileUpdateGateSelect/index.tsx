import { RadialSelected } from 'grommet-icons/es6/icons/RadialSelected'
import { Radial } from 'grommet-icons/es6/icons/Radial'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { settingsActions } from 'app/state/settings/slice'
import { selectUpdateGateCheck } from 'app/state/settings/slice/selectors'
import { SelectWithIcon } from '../SelectWithIcon'
import { runtimeIs } from 'app/lib/runtimeIs'

const getUpdateCheckIcons = (t: TFunction, size?: string) => ({
  on: <RadialSelected aria-label={t('updateGateCheck.on', 'On')} size={size} />,
  off: <Radial aria-label={t('updateGateCheck.off', 'Off')} size={size} />,
})

export const MobileUpdateGateSelect = () => {
  const { t } = useTranslation()
  const updateGateCheck = useSelector(selectUpdateGateCheck)
  const dispatch = useDispatch()
  const icons = getUpdateCheckIcons(t, '24px')
  const updateCheckOptions: { value: 'on' | 'off'; label: string }[] = [
    {
      value: 'on',
      label: t('updateGateCheck.on', 'On'),
    },
    {
      value: 'off',
      label: t('updateGateCheck.off', 'Off'),
    },
  ]

  const handleUpdateCheckChange = (newValue: 'on' | 'off') => {
    dispatch(settingsActions.changeUpdateGateCheck(newValue))
  }

  if (runtimeIs !== 'mobile-app') {
    return null
  }

  return (
    <SelectWithIcon
      label={t('updateGateCheck.title', 'Show Update Errors')}
      id="updateCheck"
      name="updateGateCheck"
      icon={icons[updateGateCheck]}
      value={updateGateCheck}
      options={updateCheckOptions}
      onChange={handleUpdateCheckChange}
    />
  )
}
