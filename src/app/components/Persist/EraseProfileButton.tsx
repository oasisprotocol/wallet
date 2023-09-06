import { Button } from 'grommet/es6/components/Button'
import { persistActions } from 'app/state/persist'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function EraseProfileButton() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
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
    </>
  )
}
